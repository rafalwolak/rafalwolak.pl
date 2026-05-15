import type { MediaValue } from "emdash";

export interface ProfileProject {
	title: string;
	client: string;
	year: string;
	summary: string;
	url?: string;
	tags: string[];
}

export const profileProjects: ProfileProject[] = [
	{
		title: "Oliver Bonas",
		client: "Tom & Co. Ltd / Oliver Bonas",
		year: "2016-Now",
		summary:
			"Frontend work for a high-traffic UK commerce experience built around Angular, TypeScript, SCSS and Magento-backed workflows.",
		url: "https://www.oliverbonas.com",
		tags: ["Angular", "TypeScript", "Magento", "SCSS"],
	},
	{
		title: "Topps Tiles",
		client: "Tom & Co. Ltd / Topps Tiles",
		year: "2016-Now",
		summary:
			"Commerce frontend delivery for a large retail catalog, focused on reliable UI, content workflows and production-ready responsive implementation.",
		url: "https://www.toppstiles.co.uk/",
		tags: ["Angular", "TypeScript", "Magento"],
	},
	{
		title: "Agent Provocateur",
		client: "Tom & Co. Ltd / Agent Provocateur",
		year: "2016-Now",
		summary:
			"Premium commerce frontend work where interaction quality, responsive behavior and editorial product presentation need to feel precise.",
		url: "https://www.agentprovocateur.com/",
		tags: ["Angular", "TypeScript", "SCSS"],
	},
	{
		title: "LeMieux",
		client: "Tom & Co. Ltd / LeMieux",
		year: "2016-Now",
		summary:
			"Commerce frontend work for an international store, combining Angular UI implementation with content and catalog-facing workflows.",
		url: "https://www.lemieux.com/",
		tags: ["Angular", "TypeScript", "Magento"],
	},
	{
		title: "Angular Headless CMS",
		client: "Tom & Co. Ltd",
		year: "2016-Now",
		summary:
			"Frontend headless CMS solution based on Angular, TypeScript, NodeJS and MongoDB, communicating with Magento backends.",
		tags: ["Angular", "TypeScript", "Headless CMS", "Magento"],
	},
];

export function asText(value: unknown, fallback = ""): string {
	return typeof value === "string" ? value : fallback;
}

export function asOptionalText(value: unknown): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function asMediaValue(value: unknown): MediaValue | string {
	return value && typeof value === "object" ? (value as MediaValue) : "";
}

export function asDate(value: unknown): Date | null {
	if (value instanceof Date) return value;
	if (typeof value !== "string" && typeof value !== "number") return null;

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}
