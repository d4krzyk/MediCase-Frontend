import { Form, FormControlProps } from "react-bootstrap";


interface Props extends Omit<FormControlProps, 'label' | 'onChange' | 'value'> {
	label: string;
	error: string;
	errorNewLine: boolean;
	value: string;
	setValue: (value: string) => void;
}

export function LabeledInput({ label, error = '', errorNewLine, value, setValue, ...props }: Props) {
	return (
		<>
			<Form.Label>{label}</Form.Label>
			{errorNewLine ? <div className='text-danger mb-2'>{error}</div> : <span className='text-danger mx-2'>{error}</span>}
			<Form.Control
				//style={FormStyle.input}
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					setValue(e.target.value);
				}}
				{...props}
			/>
		</>
	);
}
