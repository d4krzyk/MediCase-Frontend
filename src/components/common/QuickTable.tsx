import { Table } from "react-bootstrap";

interface Props {
	columnDefinitions: string[];
	items: any[];
	rowFactory: (item: any) => JSX.Element[];
	className?: string;
}

export function QuickTable({ columnDefinitions, items, rowFactory, className }: Props) {
	return (
		<Table className={`${className}`}>
			<thead>
				<tr>
					{columnDefinitions.map((columnDefinition, index) => (
						<th key={index}>{columnDefinition}</th>
					))}
				</tr>
			</thead>
			<tbody style={{ maxHeight: '67vh' }} className="table-group-divider overflow-auto rounded select_option_scroll">

				{items.map((item, index) => (
					<tr key={index}>{rowFactory(item)}</tr>
				))}
			</tbody>
		</Table>
	);
}
