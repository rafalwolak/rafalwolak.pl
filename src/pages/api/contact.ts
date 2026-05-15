import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type ContactPayload = {
	name: string;
	email: string;
	company: string;
	message: string;
	source: string;
	website: string;
};

const MAX_LENGTHS = {
	name: 120,
	email: 180,
	company: 160,
	message: 4000,
	source: 300,
};

export const POST: APIRoute = async ({ request }) => {
	const payload = await readPayload(request);

	if (payload.website) {
		return json({ ok: true });
	}

	const validationError = validatePayload(payload);
	if (validationError) {
		return json({ ok: false, message: validationError }, 400);
	}

	const db = env.DB;
	if (!db) {
		return json({ ok: false, message: "Contact storage is not available." }, 503);
	}

	const now = new Date().toISOString();
	const id = crypto.randomUUID();
	const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? "";

	try {
		await db
			.prepare(
				`CREATE TABLE IF NOT EXISTS contact_submissions (
					id TEXT PRIMARY KEY,
					name TEXT NOT NULL,
					email TEXT NOT NULL,
					company TEXT,
					message TEXT NOT NULL,
					source TEXT,
					user_agent TEXT,
					status TEXT NOT NULL DEFAULT 'new',
					created_at TEXT NOT NULL
				)`,
			)
			.run();

		await db
			.prepare(
				`INSERT INTO contact_submissions (
					id,
					name,
					email,
					company,
					message,
					source,
					user_agent,
					status,
					created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
			)
			.bind(
				id,
				payload.name,
				payload.email,
				payload.company || null,
				payload.message,
				payload.source || null,
				userAgent,
				now,
			)
			.run();

		return json({ ok: true, id });
	} catch (error) {
		console.error("Failed to store contact submission", error);
		return json({ ok: false, message: "Could not save the message." }, 500);
	}
};

async function readPayload(request: Request): Promise<ContactPayload> {
	const contentType = request.headers.get("content-type") ?? "";
	const readableRequest = request.clone();

	if (contentType.includes("application/json")) {
		const body = (await readableRequest
			.json()
			.catch(() => ({}))) as Partial<ContactPayload>;
		return normalizePayload(body);
	}

	const formData = await readableRequest.formData();
	return normalizePayload(Object.fromEntries(formData) as Partial<ContactPayload>);
}

function normalizePayload(payload: Partial<ContactPayload>): ContactPayload {
	return {
		name: normalizeText(payload.name, MAX_LENGTHS.name),
		email: normalizeText(payload.email, MAX_LENGTHS.email).toLowerCase(),
		company: normalizeText(payload.company, MAX_LENGTHS.company),
		message: normalizeText(payload.message, MAX_LENGTHS.message),
		source: normalizeText(payload.source, MAX_LENGTHS.source),
		website: normalizeText(payload.website, 200),
	};
}

function normalizeText(value: unknown, maxLength: number): string {
	return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validatePayload(payload: ContactPayload): string | null {
	if (!payload.name || !payload.email || !payload.message) {
		return "Please fill in name, email and message.";
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
		return "Please enter a valid email address.";
	}

	if (payload.message.length < 20) {
		return "Please add a little more detail to the message.";
	}

	return null;
}

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}
