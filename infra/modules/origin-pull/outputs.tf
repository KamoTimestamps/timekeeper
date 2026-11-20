output "aop_client_certificate_pem" {
  description = "Public certificate Cloudflare presents to the origin; the cluster Gateway trusts exactly this (timekeeper-aop-ca in nlopez/k8s_home)."
  value       = tls_self_signed_cert.aop.cert_pem
}
