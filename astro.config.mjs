import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700, 800],
			fallbacks: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
		},
	],
	vite: {
		optimizeDeps: {
			exclude: [
				"emdash",
				"emdash/astro",
				"emdash/ui",
				"emdash/runtime",
				"emdash/middleware",
				"emdash/middleware/auth",
				"emdash/middleware/redirect",
				"emdash/middleware/request-context",
				"emdash/middleware/setup",
				"emdash/media/local-runtime",
				"@emdash-cms/cloudflare",
				"@emdash-cms/cloudflare/db/d1",
				"@emdash-cms/cloudflare/storage/r2",
			],
		},
	},
	devToolbar: { enabled: false },
});
