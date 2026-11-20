# Infrastructure

OpenTofu config for the Cloudflare Authenticated Origin Pulls client certificates of the Timekeeper
sync servers. The servers themselves run in the Kubernetes cluster (see "Deployed servers" in
`../server/README.md`); DNS records for their hostnames are created by the cluster's external-dns, so
this config does not manage any.

| Env | Hostname | Role |
|---|---|---|
| `ash` | `ash.kamotimestamps.com` | staging: every change lands here first |
| `oak` | `oak.kamotimestamps.com` | production: gets a change only after it has run on `ash` |

Each env has its own state (`ash/terraform.tfstate`, `oak/terraform.tfstate` in the
`timekeeper-tfstate` Spaces bucket) and both call the same `modules/origin-pull`.

## Tooling

mise pins [tenv](https://github.com/tofuutils/tenv); tenv installs the OpenTofu version in
`.opentofu-version` on first use (`TENV_AUTO_INSTALL`). From `infra/`:

```
mise install
tofu version     # 1.13.2
```

## Credentials (direnv + 1Password)

`.envrc` loads these from the 1Password **Automation** vault when you `cd` into `infra/`
(`op` must be unlocked and signed in). Run `direnv allow` once, and again whenever `.envrc` changes.

| Variable | 1Password item | Used by |
|---|---|---|
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | `timekeeper-infra-tfstate` | state backend (Spaces key scoped to `timekeeper-tfstate`) |
| `CLOUDFLARE_API_TOKEN` | `timekeeper-infra-cloudflare` | `cloudflare` provider (Authenticated Origin Pulls) |

Create the Cloudflare token item once. In the Cloudflare dashboard (My Profile > API Tokens > Create
Token > Custom token) grant **Zone: Zone: Read** and **Zone: SSL and Certificates: Edit**, limited to
the `kamotimestamps.com` zone, copy it, then:

```
op item create --vault Automation --category "API Credential" \
  --title timekeeper-infra-cloudflare "credential[concealed]=$(pbpaste)"
```

One-time: create the private `timekeeper-tfstate` Spaces bucket (sfo3) and its access key.

## Only Cloudflare can connect

The cluster's `internet` Gateway requires a client certificate on every connection (Authenticated Origin
Pulls), so even another Cloudflare customer pointing their zone at the cluster's address is refused for
these hostnames. `modules/origin-pull` creates, per hostname, our own self-signed client certificate and
uploads it to Cloudflare for that hostname only (`cloudflare_authenticated_origin_pulls`). The zone's
SSL/TLS mode must be **Full (strict)**.

The private key is in the state (the private bucket) and is never written to git. The Gateway accepts the
certificate because its public half is listed in the ConfigMap `timekeeper-aop-ca`
(`apps-helm/envoy-gateway/manifests/` in nlopez/k8s_home), next to Cloudflare's own origin-pull CA. Without
that entry Cloudflare answers 520 for the hostname.

Rotate a client certificate with `tofu apply -replace=module.origin_pull.tls_private_key.aop`, and put the
new `aop_client_certificate_pem` output (`tofu output -raw aop_client_certificate_pem`) into that ConfigMap
in the same change. Apply infra and merge the ConfigMap change together; between the two, Cloudflare's
handshake fails.

## Promoting a change

1. Edit `modules/origin-pull/` (or an env's `main.tf`) on a branch.
2. `cd envs/ash && tofu init && tofu plan`, read it, then `tofu apply`.
3. Check ash through Cloudflare: `https://ash.kamotimestamps.com/healthz` returns 200.
4. Merge, then `cd envs/oak && tofu plan`. It should show the same diff ash just had. Then `tofu apply`
   and check `https://oak.kamotimestamps.com/healthz`.

Never apply oak from a commit that has not been applied to ash first.

## Not managed here yet

- Google OAuth: each environment's client needs `https://<env>.kamotimestamps.com` as an authorized
  JavaScript origin (Google Cloud console; OpenTofu cannot manage it).
- The `main` userscript channel (`client/build-tools/channels.js`) has no sync backend; wire it to oak
  when releasing.
