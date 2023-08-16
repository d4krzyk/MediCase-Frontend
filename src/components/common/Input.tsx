import { Form, FormControlProps } from "react-bootstrap";

interface Props extends Omit<FormControlProps, 'onChange' | 'value'> {
	value: string;
	setValue: (value: string) => void;
}

export function Input({ value, setValue, ...props }: Props) {
	return (
		<Form.Control
			value={value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
				setValue(e.target.value);
			}}
			{...props}
		/>
	);
}