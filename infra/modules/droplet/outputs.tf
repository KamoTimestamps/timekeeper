output "ip" {
  description = "Droplet public IPv4; point the environment's DNS record here. Changes if the droplet is rebuilt."
  value       = digitalocean_droplet.this.ipv4_address
}

output "hostname" {
  value = cloudflare_dns_record.this.name
}

output "droplet_id" {
  value = digitalocean_droplet.this.id
}

# server/deploy.sh reads these (`tofu output -raw`) and installs them on the droplet for Caddy.
output "origin_certificate_pem" {
  value = cloudflare_origin_ca_certificate.origin.certificate
}

output "origin_private_key_pem" {
  value     = tls_private_key.origin.private_key_pem
  sensitive = true
}

output "aop_client_certificate_pem" {
  description = "Public certificate Cloudflare presents to the origin; Caddy trusts exactly this."
  value       = tls_self_signed_cert.aop.cert_pem
}
