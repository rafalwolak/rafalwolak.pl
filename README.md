# rafalwolak.pl

Personal portfolio for Rafał Wolak, built with Astro, Cloudflare Workers, and EmDash CMS.

## Stack

- Astro server rendering
- Cloudflare Workers adapter
- EmDash CMS with D1 and R2 bindings
- Editable portfolio projects seeded from local profile information
- Animated hero portrait
- Contact submissions stored in D1

## Pages

| Page | Route |
|---|---|
| Homepage | `/` |
| Work listing | `/work` |
| Single project | `/work/:slug` |
| About | `/about` |
| Contact | `/contact` |
| RSS | `/rss.xml` |
| 404 | fallback |

## Infrastructure

- **Runtime:** Cloudflare Workers
- **Database:** D1
- **Storage:** R2
- **Framework:** Astro with `@astrojs/cloudflare`

## Local Development

```bash
pnpm install
pnpm dev
```

The EmDash admin UI is available at `/_emdash/admin`.

Contact form submissions are stored in the `contact_submissions` D1 table.

```bash
pnpm exec wrangler d1 execute rafalwolak-pl --local --command "SELECT name,email,company,status,created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 20"
```

## Deploying

```bash
pnpm deploy
```

Before deploying, create the D1 database and R2 bucket named in `wrangler.jsonc`, then set the production `EMDASH_ENCRYPTION_KEY` secret.
