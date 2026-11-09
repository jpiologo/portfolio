import { useEffect, useState } from "react";

export type Region = "US" | "BR";

export const DEFAULT_REGION: Region = "US";

const COUNTRY_ENDPOINT = "/api/country";
const DEV_OVERRIDE_PARAM = "country";

export const regionFromCountry = (country: string | null | undefined): Region =>
	country?.toUpperCase() === "BR" ? "BR" : DEFAULT_REGION;

const fetchCountry = async (): Promise<string | null> => {
	// Lets `npm run dev` preview each region with ?country=BR, since api/country.ts only runs on Vercel
	if (import.meta.env.DEV) return new URLSearchParams(window.location.search).get(DEV_OVERRIDE_PARAM);

	try {
		const response = await fetch(COUNTRY_ENDPOINT);
		if (!response.ok) return null;
		const { country } = (await response.json()) as { country?: string | null };
		return country ?? null;
	} catch {
		return null;
	}
};

/** null while the lookup is in flight, so callers can avoid flashing the default region. */
export const useVisitorRegion = () => {
	const [region, setRegion] = useState<Region | null>(null);

	useEffect(() => {
		let isCurrent = true;
		fetchCountry().then((country) => {
			if (isCurrent) setRegion(regionFromCountry(country));
		});
		return () => {
			isCurrent = false;
		};
	}, []);

	return region;
};
