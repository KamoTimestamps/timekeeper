variable "name" {
  description = "Environment name (ash, oak); the droplet becomes timekeeper-<name>."
  type        = string
}

variable "dns_zone" {
  description = "Cloudflare zone for the environment's hostname (<name>.<dns_zone>)."
  type        = string
  default     = "kamotimestamps.com"
}

variable "region" {
  type    = string
  default = "mkc1"
}

variable "size" {
  type    = string
  default = "s5-1vcpu-2gb-30gb"
}

variable "image" {
  type    = string
  default = "ubuntu-24-04-x64"
}

variable "backups" {
  description = "Weekly DigitalOcean droplet backups. The SQLite database lives on the droplet disk."
  type        = bool
  default     = false
}

variable "ssh_key_names" {
  description = "Names of SSH keys already uploaded to the DigitalOcean account."
  type        = list(string)
}

variable "ssh_allowed_cidrs" {
  description = "Sources allowed to reach SSH on port 22. Leave empty to close it (use Tailscale)."
  type        = list(string)
  default     = []
}

variable "tailscale_auth_key" {
  description = "Single-use, tagged Tailscale auth key, used on the droplet's first boot only. Empty skips joining."
  type        = string
  sensitive   = true
  default     = ""
}
