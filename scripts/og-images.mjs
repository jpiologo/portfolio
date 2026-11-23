/*
 * Social preview images (public/og, 1200×630), taken from the built site: `npm run build && npm run og`.
 * Posts and projects use the element marked with data-og-image; the home uses its first screen.
 * Needs Node 22+ and Chrome or Edge (CHROME_PATH points to another Chromium).
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { preview } from "vite";

const DIST = "dist";
const OUT_DIR = "public/og";
const SIZE = { width: 1200, height: 630 };
/** The home is drawn wider and scaled down, so its whole first screen fits. */
const HOME_SCALE = 1200 / 1440;
const JPEG_QUALITY = 85;
const DEBUG_PORT = 9333;

const CHROME_PATHS = [
	process.env.CHROME_PATH,
	"C:/Program Files/Google/Chrome/Application/chrome.exe",
	"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
	"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
];

const COVER_CSS = `[data-og-image] {
	position: fixed !important; inset: 0; z-index: 9999; margin: 0 !important; border: 0 !important;
	width: 100vw !important; height: 100vh !important; max-width: none; aspect-ratio: auto !important;
	border-radius: 0 !important; object-fit: cover;
}`;
const HOME_CSS = "header.fixed, aside, .skip-link { display: none !important; }";

const slugs = (section) =>
	fs
		.readdirSync(path.join(DIST, section), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map(({ name }) => `${section}/${name}`);

const covers = [...slugs("blog"), ...slugs("projects")].map((name) => ({
	name,
	url: `/${name}`,
	css: COVER_CSS,
	scale: 1,
	needs: "[data-og-image]",
}));
const homes = [
	{ name: "home", url: "/" },
	{ name: "home.pt", url: "/pt" },
].map((page) => ({ ...page, css: HOME_CSS, scale: HOME_SCALE, needs: "main h1" }));

const connect = async () => {
	for (let attempt = 0; attempt < 40; attempt++) {
		try {
			const targets = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)).json();
			const page = targets.find(({ type }) => type === "page");
			if (page) return page.webSocketDebuggerUrl;
		} catch {
			// Chrome is still starting
		}
		await sleep(250);
	}
	throw new Error("Chrome did not start");
};

const chromePath = CHROME_PATHS.find((file) => file && fs.existsSync(file));
if (!chromePath) throw new Error("Chrome not found; set CHROME_PATH");

const server = await preview({ preview: { port: 4180 } });
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, "");
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "og-images-"));
const chrome = spawn(
	chromePath,
	// English, or the site would redirect "/" to Portuguese on a Portuguese machine
	["--headless=new", `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, "--lang=en-US", "about:blank"],
	{ stdio: "ignore" },
);

try {
	const socket = new WebSocket(await connect());
	await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
	let lastId = 0;
	const pending = new Map();
	socket.addEventListener("message", ({ data }) => {
		const message = JSON.parse(data);
		pending.get(message.id)?.(message.result);
		pending.delete(message.id);
	});
	const send = (method, params = {}) =>
		new Promise((resolve) => {
			pending.set(++lastId, resolve);
			socket.send(JSON.stringify({ id: lastId, method, params }));
		});
	const evaluate = async (expression) =>
		(await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;

	await send("Page.enable");
	await send("Emulation.setScrollbarsHidden", { hidden: true });
	// Reduced motion shows every animation in its finished state
	await send("Emulation.setEmulatedMedia", {
		features: [
			{ name: "prefers-color-scheme", value: "dark" },
			{ name: "prefers-reduced-motion", value: "reduce" },
		],
	});

	for (const { name, url, css, scale, needs } of [...homes, ...covers]) {
		await send("Emulation.setDeviceMetricsOverride", {
			width: Math.round(SIZE.width / scale),
			height: Math.round(SIZE.height / scale),
			deviceScaleFactor: scale,
			mobile: false,
		});
		await send("Page.navigate", { url: baseUrl + url });
		await sleep(2000);
		if (!(await evaluate(`!!document.querySelector(${JSON.stringify(needs)})`))) {
			console.warn(`skipped ${name}: no ${needs}`);
			continue;
		}
		await evaluate(`(async () => {
			const style = document.createElement("style");
			style.textContent = ${JSON.stringify(css)};
			document.head.append(style);
			await document.fonts.ready;
		})()`);
		await sleep(500);
		const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: JPEG_QUALITY });
		const file = path.join(OUT_DIR, `${name}.jpg`);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, Buffer.from(data, "base64"));
		console.log(file);
	}
	await send("Browser.close");
} finally {
	chrome.kill();
	await server.close();
}
process.exit(0);
