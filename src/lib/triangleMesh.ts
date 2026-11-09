export type Vertex = { x: number; y: number; depth: number };
export type Triangle = [number, number, number];
export type Mesh = { vertices: Vertex[]; triangles: Triangle[] };

const ROW_HEIGHT_RATIO = Math.sqrt(3) / 2;
const JITTER_RATIO = 0.35;

/*
 * Staggered (triangular) lattice covering the area plus one cell of margin on every side,
 * so parallax shifts never reveal an empty edge. Each vertex gets a random depth (0..1)
 * that scales how far it moves with the cursor.
 */
export const buildMesh = (width: number, height: number, cellSize: number, random = Math.random): Mesh => {
	const rowHeight = cellSize * ROW_HEIGHT_RATIO;
	const cols = Math.ceil(width / cellSize) + 3;
	const rows = Math.ceil(height / rowHeight) + 3;
	const jitter = () => (random() - 0.5) * cellSize * JITTER_RATIO;

	const vertices: Vertex[] = [];
	for (let r = 0; r < rows; r++) {
		const rowShift = r % 2 === 1 ? cellSize / 2 : 0;
		for (let c = 0; c < cols; c++) {
			vertices.push({
				x: (c - 1) * cellSize + rowShift + jitter(),
				y: (r - 1) * rowHeight + jitter(),
				depth: random(),
			});
		}
	}

	const at = (r: number, c: number) => r * cols + c;
	const triangles: Triangle[] = [];
	for (let r = 0; r < rows - 1; r++) {
		for (let c = 0; c < cols - 1; c++) {
			if (r % 2 === 0) {
				triangles.push([at(r, c), at(r, c + 1), at(r + 1, c)]);
				triangles.push([at(r, c + 1), at(r + 1, c + 1), at(r + 1, c)]);
			} else {
				triangles.push([at(r, c), at(r + 1, c + 1), at(r + 1, c)]);
				triangles.push([at(r, c), at(r, c + 1), at(r + 1, c + 1)]);
			}
		}
	}

	return { vertices, triangles };
};

/** 1 at the cursor, easing out to 0 at `radius`. */
export const highlightAt = (distance: number, radius: number) => {
	const t = Math.max(0, 1 - distance / radius);
	return t * t;
};
