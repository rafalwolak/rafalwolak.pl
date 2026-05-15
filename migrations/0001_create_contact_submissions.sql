CREATE TABLE IF NOT EXISTS contact_submissions (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	company TEXT,
	message TEXT NOT NULL,
	source TEXT,
	user_agent TEXT,
	status TEXT NOT NULL DEFAULT 'new',
	created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
	ON contact_submissions (created_at DESC);
