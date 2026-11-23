import { Link, type LinkProps } from "react-router-dom";
import { useI18n } from "../i18n/context";
import { localizePath } from "../i18n/routes";

/** Internal link that stays in the current language; `to` is written as in English. */
const LocalLink = ({ to, ...props }: Omit<LinkProps, "to"> & { to: string }) => {
	const { language } = useI18n();
	return <Link to={localizePath(to, language)} {...props} />;
};

export default LocalLink;
