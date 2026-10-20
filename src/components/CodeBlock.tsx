import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";

const RESET_DELAY = 2000;

// Clipboard API needs a secure context (https/localhost); fall back to execCommand elsewhere
const copyText = async (text: string) => {
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(text);
		return;
	}
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.setAttribute("readonly", "");
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
};

/** Markdown code block with a one-click copy button in the top-right corner. */
const CodeBlock = ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), RESET_DELAY);
		return () => clearTimeout(timeout);
	}, [copied]);

	const handleCopy = async () => {
		const text = preRef.current?.querySelector("code")?.textContent ?? preRef.current?.textContent ?? "";
		try {
			await copyText(text.replace(/\n$/, ""));
			setCopied(true);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	return (
		<div className="code-block group relative">
			<pre ref={preRef} {...props}>
				{children}
			</pre>
			<button
				type="button"
				onClick={handleCopy}
				className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/5 text-xs font-medium text-gray-300 backdrop-blur-sm hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary transition-colors"
				aria-label={copied ? "Code copied" : "Copy code"}
				title={copied ? "Copied!" : "Copy code"}
			>
				{copied ? (
					<>
						<Check className="w-3.5 h-3.5 text-feedback-success" />
						Copied!
					</>
				) : (
					<>
						<Copy className="w-3.5 h-3.5" />
						Copy
					</>
				)}
			</button>
		</div>
	);
};

export default CodeBlock;
