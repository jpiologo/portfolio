import type { Comment, CommentInsert } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const COLUMNS = "id,created_at,user_name,company,commentary";

/** Supabase's REST API, called directly: its client library would weigh more than the rest of this section. */
const request = async (query: string, init: RequestInit = {}) => {
	if (!SUPABASE_URL || !SUPABASE_KEY) {
		throw new Error("Missing Supabase environment variables. Check your .env file.");
	}
	const response = await fetch(`${SUPABASE_URL}/rest/v1/comments${query}`, {
		...init,
		headers: { ...init.headers, apikey: SUPABASE_KEY },
	});
	if (!response.ok) throw new Error(`Supabase answered ${response.status}: ${await response.text()}`);
	return response;
};

/** Newest first; the RLS policy only returns approved comments. */
export const fetchComments = async (): Promise<Comment[]> => {
	const response = await request(`?select=${COLUMNS}&order=created_at.desc`);
	return response.json();
};

/** RLS saves it unapproved, so the reply must stay empty: the visitor may not read it back yet. */
export const submitComment = async (comment: CommentInsert) => {
	await request("", {
		method: "POST",
		headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
		body: JSON.stringify(comment),
	});
};
