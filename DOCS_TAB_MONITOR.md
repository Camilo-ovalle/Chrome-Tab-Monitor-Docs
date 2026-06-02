# DOCS_TAB_MONITOR.md — Blueprint de la Documentación Oficial

> **Qué es este archivo.** Es la **especificación paso a paso** para construir el sitio de
> documentación oficial de **Chrome Tab Monitor** con **Astro + Starlight**. Está pensado para
> ejecutarse en **otra sesión de Claude Code**: contiene la arquitectura, el contenido por página,
> los datos técnicos exactos (rutas de registro, plantillas de políticas, parámetros) y las reglas
> de estilo. No construye nada por sí mismo; es el plano de obra.
>
> **Decisiones ya tomadas (no re-preguntar):**
> - **Idioma del sitio:** Bilingüe **inglés + español** con i18n nativo de Starlight (`en` por
>   defecto, `es` secundario).
> - **Audiencia/alcance:** **Exclusivamente IT / Administradores** (despliegue y administración
>   empresarial). La sección de usuario final es mínima.
> - **Extension IDs:** usar **placeholders** `<CHROME_EXTENSION_ID>` y `<EDGE_EXTENSION_ID>` en
>   todos los ejemplos; nunca inventarlos.

---

## 0. Cómo usar este documento

1. Lee la **Sección 1** (objetivo/audiencia) para fijar el tono.
2. Ejecuta la **Sección 2 y 3** para crear y configurar el proyecto Astro + Starlight con i18n.
3. Crea las páginas siguiendo la **Sección 4** (arquitectura) y la **Sección 5** (contenido
   detallado por página). Cada página tiene: ruta de archivo, frontmatter, objetivo, secciones y
   los bloques de código/plantillas que debe incluir **literalmente**.
4. Usa la **Sección 6** como fuente de verdad de los datos técnicos (rutas, URLs, parámetros, tipos).
   Si un dato aparece aquí, cópialo tal cual; no lo deduzcas.
5. Aplica las **Secciones 7–10** (componentes, estilo, i18n, branding) de forma transversal.
6. Valida contra la **Sección 11** (checklist de aceptación) antes de dar por terminado.
7. Reemplaza los **placeholders de la Sección 12** únicamente cuando el operador entregue los IDs.

---

## 1. Objetivo y audiencia

**Producto:** Chrome Tab Monitor — extensión Manifest V3 para Google Chrome y Microsoft Edge que
impone límites configurables de pestañas por ventana y de ventanas totales, con cierre automático y
soporte de administración por políticas (GPO / managed storage).

**Objetivo de la documentación:** que un administrador de TI pueda **desplegar la extensión de forma
forzada** y **configurar sus parámetros de forma centralizada** en una flota de equipos Windows
(Chrome y/o Edge), por GPO, por registro y por consola en la nube, sin tocar el código.

**Audiencia primaria:** administradores de sistemas / IT de entornos corporativos o gestionados.
Se asume familiaridad con GPO, `regedit`, Active Directory, Intune y/o Google Admin Console.

**Tono:** técnico, orientado a tareas, conciso, imperativo ("Abra…", "Cree…", "Verifique…"). Cada
procedimiento incluye **prerrequisitos**, **pasos numerados** y un **paso de verificación**.

---

## 2. Stack y scaffolding

**Stack:** Astro + [Starlight](https://starlight.astro.build/) (tema de documentación oficial de
Astro), TypeScript, Markdown/MDX.

**Crear el proyecto:**

```bash
npm create astro@latest -- --template starlight tab-monitor-docs
cd tab-monitor-docs
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # build de producción → dist/
```

**Dependencias adicionales recomendadas:**

```bash
npm install sharp            # optimización de imágenes (Starlight la usa)
# Componentes ya incluidos por Starlight: Tabs, TabItem, Steps, Aside, Card, CardGrid, Code, FileTree
```

---

## 3. Configuración del proyecto (`astro.config.mjs`)

Objetivo: i18n `en`/`es`, sidebar por módulos, branding y `site`/`base` para el hosting.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  // Ajustar al dominio real donde se publique el sitio. Placeholder:
  site: 'https://<DOCS_DOMAIN>',
  // base: '/tab-monitor-docs', // solo si el sitio se sirve en una subruta
  integrations: [
    starlight({
      title: 'Chrome Tab Monitor',
      tagline: 'Enterprise deployment & administration guide',
      logo: { src: './src/assets/icon128.png', alt: 'Chrome Tab Monitor' },
      favicon: '/favicon.ico',
      // ── i18n ──
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        es: { label: 'Español', lang: 'es' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Camilo-ovalle/Tab-Limiter-chrome-Extension' },
      ],
      // El sidebar se traduce por `label` con un objeto translations (ver Sección 9).
      sidebar: [
        {
          label: 'Getting Started',
          translations: { es: 'Primeros pasos' },
          items: [
            { slug: 'getting-started/overview' },
            { slug: 'getting-started/prerequisites' },
            { slug: 'getting-started/deployment-paths' },
          ],
        },
        {
          label: 'Enterprise Bundles',
          translations: { es: 'Paquetes empresariales' },
          items: [
            { slug: 'bundles/chrome-enterprise' },
            { slug: 'bundles/microsoft-edge' },
          ],
        },
        {
          label: 'Configuration',
          translations: { es: 'Configuración' },
          items: [
            { slug: 'configuration/by-policy' },
            { slug: 'configuration/by-registry' },
            { slug: 'configuration/by-cloud-console' },
            { slug: 'configuration/parameters-reference' },
          ],
        },
        {
          label: 'Operations',
          translations: { es: 'Operación' },
          items: [
            { slug: 'operations/verification' },
            { slug: 'operations/troubleshooting' },
            { slug: 'operations/faq' },
          ],
        },
        {
          label: 'Reference',
          translations: { es: 'Referencia' },
          items: [
            { slug: 'reference/registry-paths' },
            { slug: 'reference/cross-platform' },
          ],
        },
      ],
    }),
  ],
});
```

**Estructura de carpetas (i18n raíz `en`, traducción en `es/`):**

```
src/
├─ assets/
│  └─ icon128.png            # copiar desde icons/icon128.png de la extensión
├─ content/
│  └─ docs/
│     ├─ index.mdx           # landing en inglés (raíz = defaultLocale)
│     ├─ getting-started/
│     │  ├─ overview.md
│     │  ├─ prerequisites.md
│     │  └─ deployment-paths.md
│     ├─ bundles/
│     │  ├─ chrome-enterprise.md
│     │  └─ microsoft-edge.md
│     ├─ configuration/
│     │  ├─ by-policy.md
│     │  ├─ by-registry.md
│     │  ├─ by-cloud-console.md
│     │  └─ parameters-reference.md
│     ├─ operations/
│     │  ├─ verification.md
│     │  ├─ troubleshooting.md
│     │  └─ faq.md
│     ├─ reference/
│     │  ├─ registry-paths.md
│     │  └─ cross-platform.md
│     └─ es/                 # espejo EXACTO de la estructura anterior, en español
│        ├─ index.mdx
│        ├─ getting-started/ …
│        └─ … (todas las páginas replicadas)
└─ content.config.ts         # loader de Starlight (por defecto)
```

> **Regla i18n:** cada archivo bajo `docs/` (inglés) tiene su gemelo bajo `docs/es/` con la **misma
> ruta relativa y el mismo slug base**. Starlight enruta `/<page>` (en) y `/es/<page>` (es).

---

## 4. Arquitectura de información (sitemap)

```
/  (Landing)                         → qué es, para quién, mapa de la doc
│
├─ Getting Started
│  ├─ Overview                       → qué resuelve el despliegue, flujo general
│  ├─ Prerequisites                  → permisos, herramientas, versiones
│  └─ Deployment paths               → árbol de decisión: GPO vs Registro vs Nube
│
├─ Enterprise Bundles
│  ├─ Chrome Enterprise (ADMX)       → descargar bundle, importar ADMX, force-install
│  └─ Microsoft Edge (ADMX)          → descargar plantillas, importar ADMX, force-install
│
├─ Configuration
│  ├─ By Policy (GPO/managed)        → ExtensionSettings + managed 3rdparty
│  ├─ By Registry (regedit)          → rutas exactas, tipos, .reg listos
│  ├─ By Cloud Console               → Google Admin Console + Microsoft Intune
│  └─ Parameters Reference           → tabla de los 5 parámetros gestionables
│
├─ Operations
│  ├─ Verification                   → chrome://policy, edge://policy, comprobar carga
│  ├─ Troubleshooting                → errores comunes y solución
│  └─ FAQ
│
└─ Reference
   ├─ Registry paths                 → todas las rutas en un solo lugar (cheat sheet)
   └─ Cross-platform                 → managed JSON para Linux/macOS (apéndice)
```

---

## 5. Especificación de contenido por página

> Para **cada** página: redactar la versión `en` y su gemela `es`. Los **bloques de código son
> idénticos en ambos idiomas** (solo se traduce la prosa, no los comandos ni las rutas).

### 5.1 Landing — `docs/index.mdx`

- **Frontmatter:** usar `template: splash`, `hero` con título, tagline, imagen (`icon128.png`) y dos
  CTAs: "Getting Started" y "Configuration".
- **Objetivo:** explicar en 3–4 frases qué es la extensión y a quién sirve esta documentación
  (administradores). Dejar claro que la doc es de **despliegue/administración**, no de uso final.
- **Contenido:**
  - Hero: *"Chrome Tab Monitor — Centralized tab & window limits for managed Chrome and Edge."*
  - `<CardGrid>` con 4 tarjetas que enlacen a: Getting Started, Chrome bundle, Edge bundle,
    Parameters Reference.
  - Un `<Card>` "What it does": resumen (límite de pestañas por ventana, límite de ventanas, cierre
    automático, control por GPO/registro).
- **Ejemplo de hero (frontmatter):**

```mdx
---
title: Chrome Tab Monitor
description: Enterprise deployment and administration guide for the Chrome Tab Monitor extension.
template: splash
hero:
  tagline: Centralized tab & window limits for managed Google Chrome and Microsoft Edge.
  image:
    file: ../../assets/icon128.png
  actions:
    - text: Getting Started
      link: /getting-started/overview/
      icon: right-arrow
    - text: Parameters Reference
      link: /configuration/parameters-reference/
      variant: minimal
---

import { Card, CardGrid } from '@astrojs/starlight/components';
```

### 5.2 Getting Started › Overview — `getting-started/overview.md`

- **Objetivo:** dar el panorama del despliegue empresarial y enlazar a las rutas.
- **Secciones:**
  1. *What you will deploy* — la extensión MV3 en Chrome/Edge, instalada de forma forzada.
  2. *What you can manage centrally* — los 5 parámetros gestionables (enlazar a Parameters Reference).
  3. *High-level flow* — usar `<Steps>`: (1) Force-install la extensión, (2) Configurar parámetros por
     política/registro/nube, (3) Verificar en `chrome://policy` / `edge://policy`.
  4. *Aside* `:::note` aclarando que **solo 5 parámetros** son gestionables por política; el resto se
     configura desde el popup y se sincroniza con el perfil del usuario.

### 5.3 Getting Started › Prerequisites — `getting-started/prerequisites.md`

- **Objetivo:** checklist de requisitos antes de empezar.
- **Contenido (lista):**
  - Permisos de administrador de dominio o local (para GPO/registro).
  - Acceso a la **Group Policy Management Console (GPMC)** o a la consola cloud correspondiente.
  - Navegador objetivo instalado: Google Chrome y/o Microsoft Edge (versión soportada — Manifest V3).
  - El/los **Extension ID** publicado(s): `<CHROME_EXTENSION_ID>`, `<EDGE_EXTENSION_ID>`
    (explicar dónde verlos: Chrome Web Store / Edge Add-ons, o `chrome://extensions` en modo dev).
  - (Opcional) **Central Store** de ADMX configurado en el dominio.
- **Aside** `:::caution`: los cambios por GPO/registro requieren reiniciar el navegador para aplicarse.

### 5.4 Getting Started › Deployment paths — `getting-started/deployment-paths.md`

- **Objetivo:** árbol de decisión para elegir el método.
- **Contenido:** tabla comparativa + recomendación.

| Método | Cuándo usarlo | Herramienta |
|--------|---------------|-------------|
| **GPO + ADMX** | Dominio Active Directory on-prem | GPMC + plantillas ADMX |
| **Registro (regedit / GPP)** | Equipos sueltos o ajustes finos por OU | `regedit`, Group Policy Preferences |
| **Consola en la nube** | Equipos gestionados por Google/Microsoft | Google Admin Console / Intune |

- **Aside** `:::tip`: para flotas grandes, ADMX o consola en la nube; el registro directo es ideal
  para pruebas y equipos individuales.

### 5.5 Enterprise Bundles › Chrome Enterprise — `bundles/chrome-enterprise.md`

- **Objetivo:** descargar el bundle de plantillas de Chrome, importarlo y forzar la instalación.
- **Secciones (con `<Steps>`):**
  1. **Download the Chrome Enterprise policy templates** — desde
     `https://chromeenterprise.google/browser/download/` → "Chrome browser policy templates"
     (`policy_templates.zip`). Contiene `windows/admx/chrome.admx`, `google.admx` y carpetas de idioma
     `*.adml`.
  2. **Import ADMX into the Central Store** — copiar `chrome.admx` y `google.admx` a
     `\\<dominio>\SYSVOL\<dominio>\Policies\PolicyDefinitions\` (o, para un equipo local,
     `C:\Windows\PolicyDefinitions\`); copiar los `.adml` a la subcarpeta del idioma (`en-US`, `es-ES`).
  3. **Force-install the extension** — GPMC → *Computer Configuration ▸ Administrative Templates ▸
     Google ▸ Google Chrome ▸ Extensions ▸ "Configure the list of force-installed apps and
     extensions"* → **Enabled** → añadir el valor:
     ```
     <CHROME_EXTENSION_ID>;https://clients2.google.com/service/update2/crx
     ```
  4. **Apply & verify** — `gpupdate /force`, reiniciar Chrome, abrir `chrome://policy` y confirmar
     `ExtensionInstallForcelist`.
- **Aside** `:::note`: si la extensión está publicada en la Chrome Web Store, usar la `update_url` de
  Google mostrada arriba. Ver también la página *Configuration › By Policy* para los parámetros.

### 5.6 Enterprise Bundles › Microsoft Edge — `bundles/microsoft-edge.md`

- **Objetivo:** equivalente para Edge.
- **Secciones (con `<Steps>`):**
  1. **Download the Microsoft Edge policy templates** — desde
     `https://www.microsoft.com/en-us/edge/business/download` → "Microsoft Edge policy file"
     (`MicrosoftEdgePolicyTemplates.zip`). Contiene `windows/admx/msedge.admx` y `.adml`.
  2. **Import ADMX into the Central Store** — copiar `msedge.admx` y los `.adml` igual que en Chrome.
  3. **Force-install the extension** — GPMC → *Computer Configuration ▸ Administrative Templates ▸
     Microsoft Edge ▸ Extensions ▸ "Control which extensions are installed silently"* → **Enabled** →
     añadir:
     ```
     <EDGE_EXTENSION_ID>;https://edge.microsoft.com/extensionwebstorebase/v1/crx
     ```
     > Si la extensión solo está en la Chrome Web Store y se permite en Edge, usar la `update_url` de
     > Google y habilitar *"Allow specific extensions to be installed"*.
  4. **Apply & verify** — `gpupdate /force`, reiniciar Edge, abrir `edge://policy`.
- **Aside** `:::caution`: el **Extension ID en Edge Add-ons puede diferir** del de Chrome Web Store.
  Usar `<EDGE_EXTENSION_ID>` cuando se publique en la tienda de Edge.

### 5.7 Configuration › By Policy — `configuration/by-policy.md`

- **Objetivo:** configurar parámetros vía política gestionada (managed storage) sobre los 5 keys.
- **Secciones:**
  1. *How managed configuration works* — `chrome.storage.managed` es de solo lectura; las políticas
     ganan sobre la configuración local del usuario (precedencia GPO > sync > default). Enlazar a
     Parameters Reference.
  2. *Recommended: ExtensionSettings (install)* — bloque JSON para forzar instalación de forma unificada:
     ```json
     {
       "<CHROME_EXTENSION_ID>": {
         "installation_mode": "force_installed",
         "update_url": "https://clients2.google.com/service/update2/crx"
       }
     }
     ```
  3. *Managed parameters (3rd-party policy)* — explicar que los **valores de los parámetros** se
     entregan por la política de extensión de terceros (managed storage), cuyo equivalente por
     registro está en *Configuration › By Registry*. En consola cloud existe un campo "Policy for
     extensions" donde se pega el JSON con el esquema:
     ```json
     {
       "enabled": true,
       "tabLimit": 6,
       "windowLimit": 2,
       "autoClose": true,
       "autoCloseWindows": true
     }
     ```
  4. Usar `<Tabs>` con `<TabItem label="Chrome">` y `<TabItem label="Edge">` para mostrar las rutas/IDs
     de cada navegador.
  5. **Aside** `:::note`: `notifications`, `pauseBetweenClosures`, `windowGracePeriod` y `adminRole`
     **no** forman parte del esquema gestionable (`schema.json`); no se pueden fijar por política.

### 5.8 Configuration › By Registry — `configuration/by-registry.md`

- **Objetivo:** la página de referencia operativa más importante — rutas de `regedit` exactas, tipos y
  archivos `.reg` listos para usar.
- **Secciones:**
  1. *Force-install via registry* — con `<Tabs>` Chrome/Edge:

     **Chrome:**
     ```
     Ruta:  HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist
     Valor: "1" (REG_SZ) = <CHROME_EXTENSION_ID>;https://clients2.google.com/service/update2/crx
     ```
     **Edge:**
     ```
     Ruta:  HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist
     Valor: "1" (REG_SZ) = <EDGE_EXTENSION_ID>;https://edge.microsoft.com/extensionwebstorebase/v1/crx
     ```
  2. *Configure parameters via registry* — la clave de managed storage de terceros:

     **Chrome:**
     ```
     HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\<CHROME_EXTENSION_ID>\policy
     ```
     **Edge:**
     ```
     HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\<EDGE_EXTENSION_ID>\policy
     ```
     Dentro de `…\policy`, crear un valor por parámetro con el **tipo** indicado:

     | Valor (name) | Tipo | Ejemplo | Significado |
     |--------------|------|---------|-------------|
     | `enabled` | `REG_DWORD` | `1` | 1 = activo, 0 = inactivo |
     | `tabLimit` | `REG_DWORD` | `6` | 1–100 |
     | `windowLimit` | `REG_DWORD` | `2` | 1–10 |
     | `autoClose` | `REG_DWORD` | `1` | 1 = cerrar pestañas excedentes |
     | `autoCloseWindows` | `REG_DWORD` | `1` | 1 = cerrar ventanas excedentes |

  3. *Ready-to-use `.reg` file (Chrome)* — bloque con `title="tab-monitor-chrome.reg"`:
     ```reg
     Windows Registry Editor Version 5.00

     ; Force-install Chrome Tab Monitor
     [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist]
     "1"="<CHROME_EXTENSION_ID>;https://clients2.google.com/service/update2/crx"

     ; Managed parameters
     [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\<CHROME_EXTENSION_ID>\policy]
     "enabled"=dword:00000001
     "tabLimit"=dword:00000006
     "windowLimit"=dword:00000002
     "autoClose"=dword:00000001
     "autoCloseWindows"=dword:00000001
     ```
  4. *Ready-to-use `.reg` file (Edge)* — bloque con `title="tab-monitor-edge.reg"`:
     ```reg
     Windows Registry Editor Version 5.00

     ; Force-install Chrome Tab Monitor on Edge
     [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist]
     "1"="<EDGE_EXTENSION_ID>;https://edge.microsoft.com/extensionwebstorebase/v1/crx"

     ; Managed parameters
     [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\<EDGE_EXTENSION_ID>\policy]
     "enabled"=dword:00000001
     "tabLimit"=dword:00000006
     "windowLimit"=dword:00000002
     "autoClose"=dword:00000001
     "autoCloseWindows"=dword:00000001
     ```
  5. *Deploy via Group Policy Preferences* — alternativa sin ADMX: GPMC → *Computer Configuration ▸
     Preferences ▸ Windows Settings ▸ Registry* → crear los valores apuntando a las rutas anteriores.
  6. **Aside** `:::caution`: recordar que `dword` en un archivo `.reg` se escribe en **hexadecimal**
     (p. ej. `tabLimit = 10` → `dword:0000000a`).

### 5.9 Configuration › By Cloud Console — `configuration/by-cloud-console.md`

- **Objetivo:** desplegar sin GPO on-prem, desde la nube.
- **Secciones (con `<Tabs>`):**
  - **Google Admin Console (Chrome):** *admin.google.com ▸ Devices ▸ Chrome ▸ Apps & extensions ▸
    Users & browsers* → añadir por ID, *Installation policy = Force install*, y en *Policy for
    extensions* pegar el JSON de parámetros (ver 5.7). Pegar `<CHROME_EXTENSION_ID>`.
  - **Microsoft Intune (Edge):** *Configuration profiles ▸ Settings catalog ▸ Microsoft Edge ▸
    Extensions* → *Control which extensions are installed silently* con `<EDGE_EXTENSION_ID>`; para los
    parámetros, usar OMA-URI hacia la política de extensión gestionada de Edge.
- **Aside** `:::tip`: la consola en la nube es la vía recomendada para equipos ya inscritos en
  Google/Microsoft, sin necesidad de tocar el registro.

### 5.10 Configuration › Parameters Reference — `configuration/parameters-reference.md`

- **Objetivo:** referencia canónica de los 5 parámetros gestionables (fuente: `schema.json` +
  `DEFAULT_CONFIG`).
- **Tabla:**

| Parámetro | Tipo | Default | Rango | Gestionable por política | Descripción |
|-----------|------|---------|-------|--------------------------|-------------|
| `enabled` | boolean | `true` | — | ✅ | Activa/desactiva el monitoreo global. |
| `tabLimit` | integer | `6` | 1–100 | ✅ | Máximo de pestañas por ventana. |
| `windowLimit` | integer | `2` | 1–10 | ✅ | Máximo de ventanas simultáneas. |
| `autoClose` | boolean | `true` | — | ✅ | Cierre automático de pestañas excedentes. |
| `autoCloseWindows` | boolean | `true` | — | ✅ | Cierre automático de ventanas excedentes. |

- **Sección "Not manageable by policy":** listar los que **solo** se configuran desde el popup y se
  sincronizan con el perfil (no están en `schema.json`): `notifications`, `pauseBetweenClosures`,
  `windowGracePeriod`, `adminRole`.
- **Aside** `:::note` sobre precedencia: `DEFAULT_CONFIG` < `chrome.storage.sync` (usuario) <
  `chrome.storage.managed` (política). La política **siempre gana** y bloquea el campo en el popup
  (insignia `GPO`).

### 5.11 Operations › Verification — `operations/verification.md`

- **Objetivo:** confirmar que la política se aplicó.
- **Pasos (`<Steps>`):**
  1. `gpupdate /force` (o esperar el ciclo de políticas).
  2. Reiniciar el navegador por completo.
  3. Abrir `chrome://policy` o `edge://policy` → botón **Reload policies** → verificar
     `ExtensionInstallForcelist` y la política de la extensión con los valores esperados.
  4. Abrir el popup de la extensión: los campos gestionados aparecen con la insignia **GPO** y
     deshabilitados.
  5. (Opcional) `chrome://extensions` / `edge://extensions` → confirmar que la extensión figura como
     **Installed by enterprise policy** y no se puede quitar.

### 5.12 Operations › Troubleshooting — `operations/troubleshooting.md`

- **Formato:** lista de síntoma → causa → solución (usar `<Aside>` por caso crítico).
- **Casos mínimos a cubrir:**
  - *La extensión no se instala* → ID o `update_url` incorrectos; revisar `…/policy` en
    `chrome://policy`; confirmar que la tienda no está bloqueada por otra política.
  - *Los parámetros no se aplican* → valor con tipo equivocado (debe ser `REG_DWORD`); clave bajo el
    ID equivocado; falta reiniciar el navegador.
  - *El popup no muestra la insignia GPO* → el parámetro no está en `schema.json` (no es gestionable),
    o la política no cargó.
  - *Edge no respeta el force-install* → usar la `update_url`/ID correctos de Edge; revisar
    `edge://policy`.

### 5.13 Operations › FAQ — `operations/faq.md`

- Preguntas tipo: ¿puedo gestionar `notifications` por política? (No.) ¿funciona en macOS/Linux?
  (Sí, vía managed JSON — enlazar a Cross-platform.) ¿el ID es el mismo en Chrome y Edge? (No
  necesariamente.) ¿los usuarios pueden saltarse el límite? (No, si está gestionado por política.)

### 5.14 Reference › Registry paths — `reference/registry-paths.md`

- **Objetivo:** hoja de referencia rápida (cheat sheet) con **todas** las rutas en un solo lugar
  (force-install + parámetros, Chrome + Edge), tomadas literalmente de la Sección 6.

### 5.15 Reference › Cross-platform — `reference/cross-platform.md`

- **Objetivo:** apéndice para managed storage fuera de Windows (mismo esquema JSON).
- **Contenido:**
  - **Linux (Chrome):** colocar un JSON en
    `/etc/opt/chrome/policies/managed/tab-monitor.json` con el esquema de parámetros.
  - **macOS:** managed preferences vía perfil de configuración (plist) con el dominio del navegador.
  - Reutilizar el JSON de parámetros de la Sección 5.7.

---

## 6. Datos técnicos de referencia (fuente de verdad)

> Copiar estos valores **literalmente**. No deducir ni inventar.

### 6.1 Extension IDs (placeholders)

- Chrome Web Store: `<CHROME_EXTENSION_ID>`
- Edge Add-ons: `<EDGE_EXTENSION_ID>` (puede diferir del de Chrome)

### 6.2 Update URLs (force-install)

- Chrome Web Store: `https://clients2.google.com/service/update2/crx`
- Edge Add-ons: `https://edge.microsoft.com/extensionwebstorebase/v1/crx`

### 6.3 Rutas de registro (Windows, HKLM)

| Propósito | Chrome | Edge |
|-----------|--------|------|
| Force-install | `SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist` | `SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist` |
| Parámetros (managed) | `SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\<CHROME_EXTENSION_ID>\policy` | `SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\<EDGE_EXTENSION_ID>\policy` |
| ExtensionSettings (install unificado) | `SOFTWARE\Policies\Google\Chrome\ExtensionSettings` | `SOFTWARE\Policies\Microsoft\Edge\ExtensionSettings` |

### 6.4 Parámetros gestionables (de `schema.json` + `DEFAULT_CONFIG`)

| Parámetro | Tipo JSON | Tipo registro | Default | Rango |
|-----------|-----------|---------------|---------|-------|
| `enabled` | boolean | REG_DWORD (0/1) | `true` | — |
| `tabLimit` | integer | REG_DWORD | `6` | 1–100 |
| `windowLimit` | integer | REG_DWORD | `2` | 1–10 |
| `autoClose` | boolean | REG_DWORD (0/1) | `true` | — |
| `autoCloseWindows` | boolean | REG_DWORD (0/1) | `true` | — |

**No gestionables por política** (solo UI/sync): `notifications`, `pauseBetweenClosures`,
`windowGracePeriod`, `adminRole`.

### 6.5 Precedencia de configuración

`DEFAULT_CONFIG` (código) < `chrome.storage.sync` (usuario) < `chrome.storage.managed` (política GPO).
La política gana y bloquea el campo en el popup (insignia `GPO`).

### 6.6 Páginas de verificación

- Chrome: `chrome://policy`, `chrome://extensions`
- Edge: `edge://policy`, `edge://extensions`

---

## 7. Componentes de Starlight a usar

Importar desde `@astrojs/starlight/components`:

- **`<Tabs>` / `<TabItem>`** — para alternar **Chrome ↔ Edge** y **Policy ↔ Registry**. Usar el mismo
  conjunto de labels en todo el sitio para consistencia.
- **`<Steps>`** — envolver TODAS las listas ordenadas de procedimientos (importar ADMX, force-install,
  verificación).
- **`<Aside>` / `:::note|tip|caution|danger`** — para notas, recomendaciones y advertencias.
- **`<Code>`** — bloques de código con `title=` (p. ej. `tab-monitor-chrome.reg`) y resaltado.
- **`<Card>` / `<CardGrid>`** — en la landing y en páginas índice de módulo.
- **`<FileTree>`** — para mostrar la ubicación de ADMX/ADML en el Central Store.

Ejemplo de patrón Tabs (reutilizar en toda la doc):

```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs syncKey="browser">
  <TabItem label="Google Chrome">…Chrome paths/IDs…</TabItem>
  <TabItem label="Microsoft Edge">…Edge paths/IDs…</TabItem>
</Tabs>
```

> Usar `syncKey="browser"` para que al elegir Chrome/Edge en una página, se mantenga la selección en
> las demás.

---

## 8. Guía de estilo de redacción técnica

- **Orientado a tareas:** títulos en forma de acción ("Force-install the extension", "Configure
  parameters via registry").
- **Voz imperativa y segunda persona** en procedimientos ("Open GPMC…", "Abra GPMC…").
- **Prerrequisitos arriba, verificación abajo:** cada procedimiento empieza con lo necesario y termina
  con cómo comprobar el éxito.
- **Una tarea por página/sección;** no mezclar instalación con configuración.
- **Terminología consistente:** "force-install", "managed policy", "Central Store", "Extension ID".
  No alternar sinónimos.
- **Bloques de código con `title`** cuando representen un archivo (`.reg`, `.json`, `.admx`).
- **Rutas y valores en `code`** siempre (nunca en prosa plana).
- **Advertencias con `:::caution`** para acciones que requieren reinicio o privilegios elevados.
- **Sin marketing ni superlativos;** es documentación operativa.
- **Placeholders en mayúsculas con `< >`** y nunca traducidos.

---

## 9. i18n: estructura y reglas

- Configurar `defaultLocale: 'en'` y `locales: { en, es }` (Sección 3).
- Estructura espejo: cada archivo en `docs/<ruta>` (inglés) tiene su gemelo en `docs/es/<ruta>`.
- **Traducir solo la prosa.** Comandos, rutas de registro, claves de parámetros, URLs y placeholders
  permanecen **idénticos** en ambos idiomas.
- **Sidebar bilingüe:** usar `translations: { es: '…' }` en cada grupo/ítem del sidebar (ya mostrado en
  la Sección 3).
- **UI de Starlight** (botones, "Edit page", "On this page") se traduce sola por idioma; si se necesita
  override, usar el diccionario `i18n` en `src/content/i18n/`.
- El selector de idioma aparece automáticamente al definir más de un locale.

---

## 10. Branding y tema

- **Logo:** copiar `icons/icon128.png` de la extensión a `src/assets/icon128.png`.
- **Color de acento (Starlight CSS custom):** primario `#0085ff` (Chrome/azul de la extensión).
  Definir en `src/styles/custom.css` y referenciarlo en `customCss` del config.
- **Semáforo coherente con el producto** si se usan badges: verde `#10b981` (dentro de límite), rojo
  `#ef4444` (excedido).
- Favicon derivado del icono.

```css
/* src/styles/custom.css */
:root {
  --sl-color-accent-low: #0a2a4a;
  --sl-color-accent: #0085ff;
  --sl-color-accent-high: #b9dcff;
}
```

---

## 11. Checklist de aceptación (Definition of Done)

- [ ] Proyecto Astro + Starlight creado y `npm run build` sin errores.
- [ ] i18n `en`/`es` funcionando; selector de idioma visible; todas las páginas existen en **ambos**
      idiomas con la misma estructura de rutas.
- [ ] Sidebar con los 5 grupos (Getting Started, Enterprise Bundles, Configuration, Operations,
      Reference) y labels traducidos.
- [ ] Landing con hero + CardGrid enlazando a Getting Started, Chrome bundle, Edge bundle y Parameters
      Reference.
- [ ] Páginas de bundles (Chrome y Edge) con `<Steps>` para descargar ADMX, importar al Central Store
      y force-install.
- [ ] Página *By Registry* con las rutas exactas, la tabla de tipos y los **dos archivos `.reg`**
      (Chrome y Edge) listos para copiar.
- [ ] Página *Parameters Reference* con la tabla de los 5 parámetros y la sección de "no gestionables".
- [ ] Páginas *Verification* y *Troubleshooting* con pasos y casos comunes.
- [ ] Todos los IDs son placeholders `<CHROME_EXTENSION_ID>` / `<EDGE_EXTENSION_ID>` (ningún ID
      inventado).
- [ ] Todos los `<Tabs>` Chrome/Edge usan `syncKey="browser"`.
- [ ] Tono IT/Admin; sin sección extensa de usuario final.
- [ ] Branding aplicado (logo, color de acento, favicon).

---

## 12. Placeholders a reemplazar (cuando el operador entregue los datos)

| Placeholder | Significado | Dónde obtenerlo |
|-------------|-------------|-----------------|
| `<CHROME_EXTENSION_ID>` | ID en Chrome Web Store | URL del item en la store / `chrome://extensions` |
| `<EDGE_EXTENSION_ID>` | ID en Edge Add-ons (puede diferir) | Partner Center de Edge / `edge://extensions` |
| `<DOCS_DOMAIN>` | Dominio donde se hospeda el sitio | El proveedor de hosting que se elija |

> Hasta que se entreguen, **mantener los placeholders tal cual** en todos los ejemplos.

---

### Notas de exactitud (para quien construya el sitio)

- El esquema gestionable real (`schema.json`) contiene **solo** `enabled`, `tabLimit`, `windowLimit`,
  `autoClose`, `autoCloseWindows`. No documentes otros parámetros como gestionables por política.
- Los defaults (`tabLimit: 6`, `windowLimit: 2`, etc.) provienen de `DEFAULT_CONFIG` de la extensión.
- La extensión funciona en Chrome **y** Edge; documenta ambos en paralelo con `<Tabs>`.
- No incluyas pasos de publicación en tiendas ni de desarrollo de la extensión: el alcance es
  **despliegue y administración** para IT.
