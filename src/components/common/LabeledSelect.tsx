import React from "react";
import { Form } from "react-bootstrap";

interface Props<T> {
	label: string;
	defaultValue: string;
	valueChanged: (value: string) => void;
	items: T[];
	valueFactory: (item: T) => string | number | readonly string[] | undefined;
	labelFactory: (item: T) => React.ReactNode;
	className?: string;
	size: 'sm' | 'lg' | undefined;
}

export function LabeledSelect<T>({ label, defaultValue, valueChanged, items, valueFactory, labelFactory, className, size }: Props<T>) {

	return (
		<div className={`row align-items-center ${className}`}>
			<div className="col-auto">
				{label}
			</div>
			<div className="col">
				<Form.Select size={size} defaultValue={defaultValue}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
						valueChanged(e.target.value);
					}}>
					{items.map((item, index) => {
						return (
							<option key={index} value={valueFactory(item)}>{labelFactory(item)}</option>
						)
					})}
				</Form.Select>
			</div>
		</div>
	)
}
