terraform {
  required_version = "~> 1.13"

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

# Credentials: CLOUDFLARE_API_TOKEN.
provider "cloudflare" {}

module "origin_pull" {
  source = "../../modules/origin-pull"

  name = "ash"
}

output "aop_client_certificate_pem" {
  value = module.origin_pull.aop_client_certificate_pem
}
