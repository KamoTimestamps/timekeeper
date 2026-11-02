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
