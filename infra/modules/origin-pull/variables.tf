variable "name" {
  description = "Environment name (ash, oak); the hostname is <name>.<dns_zone>."
  type        = string
}

variable "dns_zone" {
  description = "Cloudflare zone for the environment's hostname (<name>.<dns_zone>)."
  type        = string
  default     = "kamotimestamps.com"
}
