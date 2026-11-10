import type { LandMask } from "./worldLand";

/*
 * Renders one frame of a spinning Earth as text: an orthographic projection of the land mask,
 * shaded by a fixed light, with darker characters for brighter land and lighter ones for sea.
 */

/** Land characters from shadowed to lit; even the darkest is denser than any sea character. */
const LAND_RAMP = "+*#%@";
/** Sea characters from shadowed to lit; never blank, so the whole disc stays visible. */
const SEA_RAMP = ".:";
/**
 * Latitude at the centre of the disc, in degrees. Positive tips the North Pole towards the viewer,
 * which shows more of North America, Europe and Asia.
 */
const VIEW_LATITUDE_DEG = 28;
/** Light comes from the upper left and slightly in front of the viewer. */
const LIGHT = normalize([-0.5, 0.45, 0.75]);
/** Keeps the night side faintly visible so the globe's outline never disappears. */
const AMBIENT = 0.18;

function normalize([x, y, z]: number[]): [number, number, number] {
	const length = Math.hypot(x, y, z);
	return [x / length, y / length, z / length];
}

const pick = (ramp: string, brightness: number) =>
	ramp[Math.min(ramp.length - 1, Math.floor(brightness * ramp.length))];

export interface GlobeSize {
	cols: number;
	rows: number;
}

/**
 * @param rotationDeg longitude, in degrees, facing the viewer
 * @param size text grid; rows should be about 0.55 × cols because characters are taller than wide
 */
export const renderGlobeFrame = (mask: LandMask, rotationDeg: number, { cols, rows }: GlobeSize): string => {
	const tilt = (VIEW_LATITUDE_DEG * Math.PI) / 180;
	const cosTilt = Math.cos(tilt);
	const sinTilt = Math.sin(tilt);
	const lines: string[] = [];

	for (let row = 0; row < rows; row++) {
		let line = "";
		const y = 1 - ((row + 0.5) / rows) * 2; // +1 at the top
		for (let col = 0; col < cols; col++) {
			const x = ((col + 0.5) / cols) * 2 - 1; // +1 on the right
			const r2 = x * x + y * y;
			if (r2 > 1) {
				line += " ";
				continue;
			}
			const z = Math.sqrt(1 - r2); // towards the viewer
			// Undo the tilt to get the point in the globe's own frame (the disc centre maps to VIEW_LATITUDE_DEG)
			const gy = y * cosTilt + z * sinTilt;
			const gz = z * cosTilt - y * sinTilt;
			const lat = (Math.asin(gy) * 180) / Math.PI;
			const lon = (Math.atan2(x, gz) * 180) / Math.PI + rotationDeg;

			const light = Math.max(0, x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2]);
			const brightness = AMBIENT + (1 - AMBIENT) * light;
			line += mask.isLand(lon, lat) ? pick(LAND_RAMP, brightness) : pick(SEA_RAMP, brightness);
		}
		lines.push(line.trimEnd());
	}
	return lines.join("\n");
};
