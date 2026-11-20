terraform {
  required_providers {
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

data "cloudflare_zone" "this" {
  filter = {
    name = var.dns_zone
  }
}

# Authenticated Origin Pulls: Cloudflare presents this client certificate on every connection to the
# hostname. The cluster's internet Gateway trusts exactly this public certificate (ConfigMap
# timekeeper-aop-ca in nlopez/k8s_home), so a different Cloudflare account pointing its zone at our
# origin is refused. It is our own certificate rather than Cloudflare's shared one. The private key
# goes to Cloudflare and stays in the state.
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
