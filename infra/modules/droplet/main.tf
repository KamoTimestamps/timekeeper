terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

locals {
  fqdn = "${var.name}.${var.dns_zone}"
}

data "cloudflare_ip_ranges" "this" {}

data "digitalocean_ssh_key" "admin" {
  for_each = toset(var.ssh_key_names)
  name     = each.value
}

resource "digitalocean_droplet" "this" {
  name    = "timekeeper-${var.name}"
  region  = var.region
  size    = var.size
  image   = var.image
  backups = var.backups

  ssh_keys = [for key in data.digitalocean_ssh_key.admin : key.id]

  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    auth_key = var.tailscale_auth_key
    hostname = "timekeeper-${var.name}"
  })

  lifecycle {
    # DigitalOcean retires old image slugs, and the one-time Tailscale auth key lives in user_data;
    # changing either must be a deliberate rebuild (tofu apply -replace), not drift.
    ignore_changes = [image, user_data]
  }
}

# Only Cloudflare reaches the origin: 443 is open to Cloudflare's published ranges and nothing else
# (port 80 is closed; Caddy serves HTTPS only, with a Cloudflare Origin CA certificate, so there is no
# ACME challenge to answer). Caddy additionally requires Cloudflare's client certificate (see
# "Authenticated Origin Pulls" below), so a request from a Cloudflare IP that is not our zone is refused.
# The ranges are read at apply time; when Cloudflare changes them, the next plan shows the diff.
# SSH is reached over Tailscale (outbound only), so port 22 is open only if ssh_allowed_cidrs is set.
resource "digitalocean_firewall" "this" {
  name        = "timekeeper-${var.name}"
  droplet_ids = [digitalocean_droplet.this.id]

  dynamic "inbound_rule" {
    for_each = length(var.ssh_allowed_cidrs) > 0 ? [1] : []
    content {
      protocol         = "tcp"
      port_range       = "22"
      source_addresses = var.ssh_allowed_cidrs
    }
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = concat(data.cloudflare_ip_ranges.this.ipv4_cidrs, data.cloudflare_ip_ranges.this.ipv6_cidrs)
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# <name>.<dns_zone>, proxied through Cloudflare (which sends the CF-* headers the server trusts).
data "cloudflare_zone" "this" {
  filter = {
    name = var.dns_zone
  }
}

resource "cloudflare_dns_record" "this" {
  zone_id = data.cloudflare_zone.this.zone_id
  name    = local.fqdn
  type    = "A"
  content = digitalocean_droplet.this.ipv4_address
  proxied = true
  ttl     = 1 # automatic
  comment = "Managed by OpenTofu (KamoTimestamps/timekeeper infra/)"
}

# Origin certificate: issued by Cloudflare's Origin CA, valid 15 years, trusted only by Cloudflare
# (zone SSL/TLS mode "Full (strict)"). Let's Encrypt cannot be used because it could not reach an origin
# that only accepts Cloudflare. server/deploy.sh copies the certificate and key to the droplet.
resource "tls_private_key" "origin" {
  algorithm   = "ECDSA"
  ecdsa_curve = "P256"
}

resource "tls_cert_request" "origin" {
  private_key_pem = tls_private_key.origin.private_key_pem
  dns_names       = [local.fqdn]

  subject {
    common_name = local.fqdn
  }
}

resource "cloudflare_origin_ca_certificate" "origin" {
  csr                = tls_cert_request.origin.cert_request_pem
  hostnames          = [local.fqdn]
  request_type       = "origin-ecc"
  requested_validity = 5475
}

# Authenticated Origin Pulls: Cloudflare presents this client certificate on every connection to the
# hostname and Caddy only accepts connections that present it. It is our own certificate rather than
# Cloudflare's shared one, so a different Cloudflare account pointing its zone at our IP is refused.
# Caddy gets the public certificate only; the private key goes to Cloudflare and stays in the state.
resource "tls_private_key" "aop" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_self_signed_cert" "aop" {
  private_key_pem       = tls_private_key.aop.private_key_pem
  validity_period_hours = 87600 # 10 years; rotate with tofu apply -replace=...tls_private_key.aop
  allowed_uses          = ["digital_signature", "client_auth"]

  subject {
    common_name = "${local.fqdn} authenticated origin pull"
  }
}

resource "cloudflare_authenticated_origin_pulls_hostname_certificate" "aop" {
  zone_id     = data.cloudflare_zone.this.zone_id
  certificate = tls_self_signed_cert.aop.cert_pem
  private_key = tls_private_key.aop.private_key_pem
}

resource "cloudflare_authenticated_origin_pulls" "this" {
  zone_id = data.cloudflare_zone.this.zone_id

  config = [{
    hostname = local.fqdn
    cert_id  = cloudflare_authenticated_origin_pulls_hostname_certificate.aop.id
    enabled  = true
  }]
}
