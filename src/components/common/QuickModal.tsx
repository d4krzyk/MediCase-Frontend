import { Modal } from "react-bootstrap";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className: string,
	show: boolean;
	setShow: (show: boolean) => void;
}

export function QuickModal({ className, children, show, setShow}: Props) {
	return (
		<Modal className={className} show={show} onHide={() => setShow(false)}>
			{children}
		</Modal>
	);
}
