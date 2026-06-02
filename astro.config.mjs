// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeSix from '@six-tech/starlight-theme-six';

// https://astro.build/config
export default defineConfig({
	// Replace this URL with the real hosting domain before publishing.
	site: 'https://docs-placeholder.example.com',
	// base: '/tab-monitor-docs', // uncomment if served under a sub-path

	integrations: [
		starlight({
			title: 'Chrome Tab Monitor',
			tagline: 'Enterprise deployment & administration guide',
			favicon: '/favicon.svg',
			logo: { src: './src/assets/transparent.png', alt: '' },
			customCss: ['./src/styles/custom.css'],

			plugins: [
				starlightThemeSix({
					navLinks: [
						{
							label: 'GitHub',
							link: 'https://github.com/Camilo-ovalle/Tab-Limiter-chrome-Extension',
							attrs: { target: '_blank', rel: 'noopener' },
						},
					],
					footerText: 'Chrome Tab Monitor — Enterprise Administration Guide',
				}),
			],

			// ── i18n (phase 1: English only; add 'es' locale in phase 2) ──
			defaultLocale: 'en',

			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/Camilo-ovalle/Tab-Limiter-chrome-Extension',
				},
			],

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
