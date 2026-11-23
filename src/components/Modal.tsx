import type React from "react";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsHydrated } from "../lib/useIsHydrated";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	/** Accessible name of the dialog. */
	label: string;
	/** "drawer" slides its panel in from the right edge; "center" fades it in mid-screen. */
	variant?: "center" | "drawer";
	/** When false, Escape and backdrop clicks are ignored (e.g. while a form is being sent). */
	isDismissible?: boolean;
	/** The panel; it must be a single element. */
	children: ReactNode;
};

const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

const Dialog = ({ isOpen, onClose, label, variant = "center", isDismissible = true, children }: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const pressStartedOnBackdrop = useRef(false);

	// Layout effect: its cleanup runs while the dialog is still in the page, so closing can restore focus
	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || !isOpen) return;
		const root = document.documentElement;
		root.style.setProperty("--scrollbar-width", `${window.innerWidth - root.clientWidth}px`);
		dialog.showModal();
		return () => dialog.close();
	}, [isOpen]);

	const onCancel = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (isDismissible) onClose();
	};

	// Browsers may force a dialog closed (e.g. Escape pressed twice), so the state has to follow
	const onNativeClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		if (isOpen && !e.currentTarget.open) onClose();
	};

	// A drag that starts inside the panel (selecting text) and ends on the backdrop must not close it
	const onPointerDown = (e: React.PointerEvent) => {
		pressStartedOnBackdrop.current = e.target === e.currentTarget;
	};

	const onClick = (e: React.MouseEvent) => {
		if (isDismissible && pressStartedOnBackdrop.current && e.target === e.currentTarget) onClose();
	};

	return createPortal(
		<dialog
			ref={dialogRef}
			aria-label={label}
			className={`modal ${variant === "drawer" ? "modal-drawer" : ""}`}
			onCancel={onCancel}
			onClose={onNativeClose}
			onPointerDown={onPointerDown}
			onClick={onClick}
			// React events bubble through portals, so a swipe in here would also move a carousel that renders it
			onTouchStart={stopPropagation}
			onTouchEnd={stopPropagation}
		>
			{children}
		</dialog>,
		document.body,
	);
};

/** Native modal dialog: the browser traps and restores focus, and hides the page behind it (styles: `.modal` in index.css). */
const Modal = (props: ModalProps) => {
	// Portals can't be rendered on the server
	const isHydrated = useIsHydrated();
	return isHydrated ? <Dialog {...props} /> : null;
};

export default Modal;
