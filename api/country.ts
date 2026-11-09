// Vercel Function: GET /api/country -> { "country": "BR" }
// The visitor's country only reaches the server as a request header, so the browser asks for it here.
const ONE_DAY_SECONDS = 86400;

// When the Cloudflare proxy (orange cloud) is on, Vercel only sees Cloudflare's edge IP,
// so Cloudflare's header is the accurate one; with DNS-only, only Vercel's header exists.
const COUNTRY_HEADERS = ["cf-ipcountry", "x-vercel-ip-country"];

export function GET(request: Request) {
	const country = COUNTRY_HEADERS.map((name) => request.headers.get(name)).find(Boolean) ?? null;

	return Response.json(
		{ country },
		// private: each visitor gets their own answer, never a shared CDN copy
		{ headers: { "Cache-Control": `private, max-age=${ONE_DAY_SECONDS}` } },
	);
}
