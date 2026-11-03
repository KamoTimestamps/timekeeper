# Infrastructure

OpenTofu config for the Timekeeper Sync droplets on DigitalOcean.

| Env | Droplet | Role |
|---|---|---|
| `ash` | `timekeeper-ash` | staging: every change lands here first |
| `oak` | `timekeeper-oak` | production: gets a change only after it has run on `ash` |

Each env also owns its proxied Cloudflare A record (`ash.kamotimestamps.com`, `oak.kamotimestamps.com`),
which follows the droplet's IP if it is rebuilt.

Each env has its own state (`ash/terraform.tfstate`, `oak/terraform.tfstate` in the
`timekeeper-tfstate` Spaces bucket) and both call the same `modules/droplet`.

## Tooling

mise pins [tenv](https://github.com/tofuutils/tenv); tenv installs the OpenTofu version in
`.opentofu-version` on first use (`TENV_AUTO_INSTALL`). From `infra/`:

```
mise install
tofu version     # 1.13.2
```

## Credentials (direnv + 1Password)

`.envrc` loads these from the 1Password **Automation** vault when you `cd` into `infra/`
(`op` must be unlocked and signed in). Run `direnv allow` once.

| Variable | 1Password item | Used by |
|---|---|---|
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | `timekeeper-infra-tfstate` | state backend (Spaces key scoped to `timekeeper-tfstate`) |
| `DIGITALOCEAN_TOKEN` | `timekeeper-infra-digitalocean` | `digitalocean` provider |
| `CLOUDFLARE_API_TOKEN` | `timekeeper-infra-cloudflare` | `cloudflare` provider (DNS records) |

Create the DigitalOcean token item once (copy a dedicated API token to the clipboard first):

```
op item create --vault Automation --category "API Credential" \
  --title timekeeper-infra-digitalocean "credential[concealed]=$(pbpaste)"
```

Create the Cloudflare token item the same way. In the Cloudflare dashboard (My Profile > API Tokens >
Create Token > Custom token) grant **Zone: Zone: Read**, **Zone: DNS: Edit** and **Zone: SSL and
Certificates: Edit** (Origin CA certificate and Authenticated Origin Pulls), limited to the
`kamotimestamps.com` zone, copy it, then:

```
op item create --vault Automation --category "API Credential" \
  --title timekeeper-infra-cloudflare "credential[concealed]=$(pbpaste)"
```

The Tailscale auth key is single-use, so it is not stored; see below.

## Only Cloudflare can connect

Each droplet accepts TCP 443 from Cloudflare's published IP ranges and nothing else; port 80 is closed.
On top of the firewall, Caddy requires a client certificate (Authenticated Origin Pulls), so even another
Cloudflare customer pointing their zone at the droplet's IP is refused. `modules/droplet` creates:

- an Origin CA certificate for `<env>.kamotimestamps.com` (15 years; Let's Encrypt can no longer reach the
  origin), served by Caddy. The zone's SSL/TLS mode must be **Full (strict)**.
- our own client certificate, uploaded to Cloudflare for that hostname only and enabled through
  `cloudflare_authenticated_origin_pulls`. Caddy trusts exactly that certificate.

The private keys are in the state (the private bucket) and are never written to git.
`server/deploy.sh` reads the outputs and installs them on the droplet, so **apply infra before
deploying**. Cloudflare's IP ranges are read when you apply; if they change, `tofu plan` shows the new
firewall rule. Rotate the client certificate with
`tofu apply -replace=module.droplet.tls_private_key.aop` (then redeploy), the origin certificate with
`-replace=module.droplet.cloudflare_origin_ca_certificate.origin`.

## SSH over Tailscale

Port 22 is closed to the internet. On first boot, cloud-init (`modules/droplet/cloud-init.yaml.tftpl`)
installs Tailscale and joins the tailnet as `timekeeper-<env>` with `--ssh` (Tailscale SSH) and the
tag `tag:timekeeper`, so `ssh root@timekeeper-ash` works from any device on the tailnet.

One-time tailnet setup (admin console):

1. Access controls: add `"tagOwners": {"tag:timekeeper": ["autogroup:admin"]}` and an `ssh` rule
   allowing your user to reach `tag:timekeeper` as `root`.
2. Settings > Keys > Generate auth key: **not** reusable, **not** ephemeral, pre-approved, tag
   `tag:timekeeper`, expiry 1 day. Make one per droplet you create.

Pass the key for the creating apply only: `export TF_VAR_tailscale_auth_key=tskey-auth-...`. It lives
in the droplet's `user_data` (and the private state bucket), which is why it must be single-use and
short-lived. The droplet ignores later `user_data` changes; to re-run cloud-init, rebuild with
`tofu apply -replace=module.droplet.digitalocean_droplet.this`.

If the droplet never shows up in the tailnet, there is no SSH. Recover with the DigitalOcean web
console, or set `ssh_allowed_cidrs = ["<your IP>/32"]` and apply to open port 22 temporarily.

One-time: create the private `timekeeper-tfstate` Spaces bucket (sfo3), upload your SSH public key to
DigitalOcean, and copy `envs/terraform.tfvars.example` to `envs/ash/terraform.tfvars` and
`envs/oak/terraform.tfvars` (gitignored).

## Promoting a change

1. Edit `modules/droplet/` (or an env's `main.tf`) on a branch.
2. `cd envs/ash && tofu init && tofu plan`, read it, then `tofu apply`.
3. Deploy and check the app on ash (`cd server && ./deploy.sh ash`, over Tailscale).
4. Merge, then `cd envs/oak && tofu plan`. It should show the same diff ash just had. Then `tofu apply`.

Never apply oak from a commit that has not been applied to ash first.

## Not managed here yet

- Google OAuth: each environment's client needs `https://<env>.kamotimestamps.com` as an authorized
  JavaScript origin (Google Cloud console; OpenTofu cannot manage it).
- The `main` userscript channel (`client/build-tools/channels.js`) has no sync backend; wire it to oak
  when releasing.
