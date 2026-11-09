import type { Region } from "../lib/region";

const US_STRIPE_COUNT = 13;
const US_STRIPE_HEIGHT = 100 / US_STRIPE_COUNT;
const US_CANTON = { width: 76, height: US_STRIPE_HEIGHT * 7 };
const US_STAR_ROWS = 9;

// 50 stars: 9 rows alternating 6 and 5, on the classic offset grid
const usStars = Array.from({ length: US_STAR_ROWS }, (_, row) => {
	const isLongRow = row % 2 === 0;
	const count = isLongRow ? 6 : 5;
	const y = ((row + 1) * US_CANTON.height) / (US_STAR_ROWS + 1);
	return Array.from({ length: count }, (_, col) => ({
		x: ((isLongRow ? 2 * col + 1 : 2 * col + 2) * US_CANTON.width) / 12,
		y,
	}));
}).flat();

const UsFlag = () => (
	<svg viewBox="0 0 190 100" className="h-full w-auto">
		<rect width="190" height="100" fill="#B22234" />
		{Array.from({ length: (US_STRIPE_COUNT - 1) / 2 }, (_, i) => (
			<rect key={i} y={(2 * i + 1) * US_STRIPE_HEIGHT} width="190" height={US_STRIPE_HEIGHT} fill="#FFFFFF" />
		))}
		<rect width={US_CANTON.width} height={US_CANTON.height} fill="#3C3B6E" />
		{usStars.map(({ x, y }) => (
			<circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fill="#FFFFFF" />
		))}
	</svg>
);

const BrFlag = () => (
	<svg viewBox="0 0 20 14" className="h-full w-auto">
		<defs>
			<clipPath id="br-flag-globe">
				<circle cx="10" cy="7" r="3.5" />
			</clipPath>
		</defs>
		<rect width="20" height="14" fill="#009C3B" />
		<polygon points="1.7,7 10,1.7 18.3,7 10,12.3" fill="#FFDF00" />
		<circle cx="10" cy="7" r="3.5" fill="#002776" />
		<path
			d="M6 6.2 Q10 4.9 14 7.6"
			fill="none"
			stroke="#FFFFFF"
			strokeWidth="0.55"
			clipPath="url(#br-flag-globe)"
		/>
	</svg>
);

const FLAGS: Record<Region, { label: string; Flag: () => JSX.Element }> = {
	US: { label: "United States", Flag: UsFlag },
	BR: { label: "Brazil", Flag: BrFlag },
};

const RegionFlag = ({ region, className = "" }: { region: Region; className?: string }) => {
	const { label, Flag } = FLAGS[region];
	return (
		<span
			role="img"
			aria-label={label}
			title={label}
			className={`inline-flex overflow-hidden rounded-[3px] ring-1 ring-text-primary/15 shadow-sm ${className}`}
		>
			<Flag />
		</span>
	);
};

export default RegionFlag;
