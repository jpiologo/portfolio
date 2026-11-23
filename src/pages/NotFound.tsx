import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import LocalLink from "../components/LocalLink";
import { useI18n } from "../i18n/context";

const NotFound = () => {
	const t = useI18n();

	useEffect(() => {
		document.title = t.notFound.documentTitle;
	}, [t]);

	return (
		<section className="pt-40 pb-24 bg-background-base min-h-screen">
			<div className="max-w-3xl mx-auto px-4 text-center">
				<h1 className="text-4xl font-bold text-text-primary mb-4">{t.notFound.title}</h1>
				<p className="text-text-muted text-lg mb-10">{t.notFound.text}</p>
				<LocalLink to="/" className="btn-primary">
					<ArrowLeft className="w-4 h-4" aria-hidden="true" />
					{t.notFound.backHome}
				</LocalLink>
			</div>
		</section>
	);
};

export default NotFound;
