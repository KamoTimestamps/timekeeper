terraform {
  required_version = "~> 1.13"

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

  # Spaces is S3-compatible. Credentials: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (Spaces keys).
  backend "s3" {
    bucket = "timekeeper-tfstate"
    key    = "ash/terraform.tfstate"
    region = "us-east-1" # ignored by Spaces, required by the backend

    endpoints                   = { s3 = "https://sfo3.digitaloceanspaces.com" }
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
  }
}

# Credentials: DIGITALOCEAN_TOKEN.
provider "digitalocean" {}

# Credentials: CLOUDFLARE_API_TOKEN.
provider "cloudflare" {}

variable "ssh_key_names" {
  type = list(string)
}

variable "ssh_allowed_cidrs" {
  type    = list(string)
  default = []
}

variable "tailscale_auth_key" {
  type      = string
  sensitive = true
  default   = ""
}

module "droplet" {
  source = "../../modules/droplet"

  name               = "ash"
  backups            = false
  ssh_key_names      = var.ssh_key_names
  ssh_allowed_cidrs  = var.ssh_allowed_cidrs
  tailscale_auth_key = var.tailscale_auth_key
}

output "ip" {
  value = module.droplet.ip
}
