# Chrome Tab Monitor — Documentation Site

Enterprise deployment and administration guide for the **Chrome Tab Monitor** browser extension. Covers force-installation via Group Policy, managed parameter configuration, and fleet-wide operations for Google Chrome and Microsoft Edge.

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

---

## Stack

| Tool | Version |
| :--- | :------ |
| Astro | 6 |
| Starlight | 0.39 |
| Theme | `@six-tech/starlight-theme-six` |
| Fonts | Inter · JetBrains Mono (`@fontsource`) |

---

## Project Structure

```
.
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── transparent.png
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx                          # Landing page
│   │       ├── getting-started/
│   │       │   ├── overview.mdx
│   │       │   ├── prerequisites.mdx
│   │       │   └── deployment-paths.mdx
│   │       ├── bundles/
│   │       │   ├── chrome-enterprise.mdx
│   │       │   └── microsoft-edge.mdx
│   │       ├── configuration/
│   │       │   ├── by-policy.mdx
│   │       │   ├── by-registry.mdx
│   │       │   ├── by-cloud-console.mdx
│   │       │   └── parameters-reference.mdx
│   │       ├── operations/
│   │       │   ├── verification.mdx
│   │       │   ├── troubleshooting.mdx
│   │       │   └── faq.mdx
│   │       └── reference/
│   │           ├── registry-paths.mdx
│   │           └── cross-platform.mdx
│   ├── overrides/
│   │   └── SiteTitle.astro
│   ├── styles/
│   │   └── custom.css
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Commands

Run from the project root:

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

---

## Deployment paths covered

- **GPO + ADMX** — Active Directory with Chrome or Edge ADMX templates
- **Windows Registry** — `.reg` files and PowerShell scripts for standalone machines
- **Cloud Console** — Google Admin Console (Chrome) and Microsoft Intune (Edge)
- **Linux / macOS** — Managed JSON policy files

## Placeholders

The published docs under `src/content/docs/**` use the real published Extension IDs:

| Placeholder | Where | Status |
| :---------- | :---- | :----- |
| `<CHROME_EXTENSION_ID>` | All pages referencing Chrome Web Store ID | ✅ Replaced with `apbgiakfdalcpmnopopopookdceecnfj` |
| `<EDGE_EXTENSION_ID>` | All pages referencing Edge Add-ons store ID | ✅ Replaced with `aidfbccdmjdoloknpoiacciagffokjcb` |
| `site:` in `astro.config.mjs` | Real domain | ✅ Set to `https://camilo-ovalle.github.io` |

## Phase 2 — Spanish translation (pending)

The sidebar already includes `translations: { es: '...' }` keys for all groups. To activate Spanish:

1. Create `src/content/docs/es/` mirror of all 15 pages.
2. Add `locales: { es: { label: 'Español', lang: 'es' } }` to `astro.config.mjs`.

---

## Related repositories

- Extension source: [`Tab-Limiter-chrome-Extension`](https://github.com/Camilo-ovalle/Tab-Limiter-chrome-Extension)
