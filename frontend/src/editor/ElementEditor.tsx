import * as Preact from 'preact';
import { PropsTable, AdminDefinition } from 'common/definition';

import { Form } from '../input';
import PropInput from './PropInput';

interface TableProps {
	props: PropsTable;
	values: any;
	path: string;
	handleSet: (key: string, value: any) => void;
}

function Table({ props, values, path, handleSet }: TableProps) {
	return (
		<div>
			{Object.entries(props).map(([ key, value ]) => {
				const thisPath = path + (path !== '' ? '.' : '') + key;
				if ('fields' in value) {
					return <Table key={thisPath} props={value.fields}
						values={values[key]} path={thisPath} handleSet={handleSet}/>;
				}
				else if ('entries' in value) {
					return <p>Array props can't be edited.</p>;
				}
				else {
					return <PropInput key={thisPath} prop={value} value={values[key]}
						identifier={key} onChange={value => handleSet(key, value)}/>;
				}
			})}
		</div>
	);
}

interface Props {
	props: PropsTable;
	definition: AdminDefinition;
	
	onChange: (props: any) => void;
}

export default function ElementEditor({ props, definition, onChange }: Props) {
	const propDefs = definition.config.props;

	const handleSet = (key: string, value: any) => onChange({ ...props, [key]: value });

	return (
		<Form>
			<Table props={propDefs} values={props} path='' handleSet={handleSet}/>
		</Form>
	);
}
