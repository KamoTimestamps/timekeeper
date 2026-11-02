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
  }
}

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

# Caddy answers ACME challenges and Cloudflare connects on 443, so 80/443 stay open to everyone;
# Caddy itself refuses forged Cloudflare headers from non-Cloudflare peers (server/deploy/Caddyfile).
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
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol         = "udp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
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
  name    = "${var.name}.${var.dns_zone}"
  type    = "A"
  content = digitalocean_droplet.this.ipv4_address
  proxied = true
  ttl     = 1 # automatic
  comment = "Managed by OpenTofu (KamoTimestamps/timekeeper infra/)"
}
