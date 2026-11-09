import { useEffect, useRef } from "react";
import { buildMesh, highlightAt, type Mesh, type Vertex } from "../lib/triangleMesh";

const CELL_SIZE = 110;
const PARALLAX_PX = 36;
const HIGHLIGHT_RADIUS = 240;
const HIGHLIGHT_FILL_ALPHA = 0.12;
const HIGHLIGHT_STROKE_ALPHA = 0.65;
const EASING = 0.08;
const SETTLE_PX = 0.5;
const SETTLE_STRENGTH = 0.005;
const MAX_PIXEL_RATIO = 2;

type MeshColors = { line: string; lineAlpha: number; glow: string };

// Colors are theme tokens in index.css, so light/dark is decided there, not here
const readColors = (): MeshColors => {
	const style = getComputedStyle(document.documentElement);
	return {
		line: style.getPropertyValue("--c-mesh-line").trim(),
		lineAlpha: Number(style.getPropertyValue("--mesh-line-alpha")),
		glow: style.getPropertyValue("--c-mesh-glow").trim(),
	};
};

const traceTriangle = (ctx: CanvasRenderingContext2D, a: Vertex, b: Vertex, c: Vertex) => {
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.lineTo(c.x, c.y);
	ctx.closePath();
};

/*
 * Fixed full-viewport background: a triangle mesh whose vertices drift against the cursor
 * by their own depth (parallax), with the triangles near the cursor lit up.
 * Redraws only while easing toward the cursor, so an idle page costs nothing.
 */
const TriangleMesh = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const parallax = reducedMotion ? 0 : PARALLAX_PX;
		const easing = reducedMotion ? 1 : EASING;

		let mesh: Mesh = { vertices: [], triangles: [] };
		let meshWidth = 0;
		let colors = readColors();
		let width = 0;
		let height = 0;
		let frame = 0;
		const target = { x: 0, y: 0, strength: 0 };
		const current = { x: 0, y: 0, strength: 0 };

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			const offsetX = -(current.x / width - 0.5) * parallax;
			const offsetY = -(current.y / height - 0.5) * parallax;
			const points = mesh.vertices.map((v) => ({
				x: v.x + offsetX * v.depth,
				y: v.y + offsetY * v.depth,
				depth: v.depth,
			}));

			ctx.lineWidth = 1;
			ctx.lineJoin = "round";
			ctx.strokeStyle = `rgb(${colors.line} / ${colors.lineAlpha})`;
			ctx.beginPath();
			for (const [a, b, c] of mesh.triangles) traceTriangle(ctx, points[a], points[b], points[c]);
			ctx.stroke();

			if (current.strength < SETTLE_STRENGTH) return;

			for (const [a, b, c] of mesh.triangles) {
				const pa = points[a];
				const pb = points[b];
				const pc = points[c];
				const distance = Math.hypot((pa.x + pb.x + pc.x) / 3 - current.x, (pa.y + pb.y + pc.y) / 3 - current.y);
				const glow = highlightAt(distance, HIGHLIGHT_RADIUS) * current.strength;
				if (glow <= 0) continue;

				ctx.beginPath();
				traceTriangle(ctx, pa, pb, pc);
				ctx.fillStyle = `rgb(${colors.glow} / ${glow * HIGHLIGHT_FILL_ALPHA})`;
				ctx.fill();
				ctx.strokeStyle = `rgb(${colors.glow} / ${glow * HIGHLIGHT_STROKE_ALPHA})`;
				ctx.stroke();
			}
		};

		const step = () => {
			current.x += (target.x - current.x) * easing;
			current.y += (target.y - current.y) * easing;
			current.strength += (target.strength - current.strength) * easing;
			draw();

			const settled =
				Math.abs(target.x - current.x) < SETTLE_PX &&
				Math.abs(target.y - current.y) < SETTLE_PX &&
				Math.abs(target.strength - current.strength) < SETTLE_STRENGTH;
			frame = settled ? 0 : requestAnimationFrame(step);
		};

		const animate = () => {
			if (!frame) frame = requestAnimationFrame(step);
		};

		const resize = () => {
			const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

			// Mobile toolbars change the height while scrolling; rebuilding then would make the mesh jump
			if (width !== meshWidth) {
				mesh = buildMesh(width, Math.max(height, window.screen.height), CELL_SIZE);
				meshWidth = width;
			}
			if (target.strength === 0) {
				target.x = current.x = width / 2;
				target.y = current.y = height / 2;
			}
			draw();
		};

		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType !== "mouse") return;
			target.x = e.clientX;
			target.y = e.clientY;
			target.strength = 1;
			animate();
		};

		const onPointerLeave = () => {
			target.strength = 0;
			animate();
		};

		const themeObserver = new MutationObserver(() => {
			colors = readColors();
			draw();
		});

		resize();
		window.addEventListener("resize", resize);
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		document.documentElement.addEventListener("mouseleave", onPointerLeave);
		themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointermove", onPointerMove);
			document.documentElement.removeEventListener("mouseleave", onPointerLeave);
			themeObserver.disconnect();
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
		/>
	);
};

export default TriangleMesh;
