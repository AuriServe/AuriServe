import { h } from 'preact';
import { tw } from 'dashboard';
import { ClientFieldProps } from '../Type';

export default function RowField({ field, data }: { field: ClientFieldProps, data: any }) {
	switch (field.type) {
		case 'text':
		case 'textarea':
		case 'tel':
		case 'email': {
			return <span class={tw`font-medium text-gray-100 text-sm line-clamp-1
				overflow-ellipsis max-w-full block whitespace-pre overflow-hidden max-w-full`}>{data}</span>
		}
		case 'select': {
			const selected = field.multiple ? data : [ data ];
			return <div class={tw`flex gap-1 overflow-hidden relative isolate`}>
				<div class={tw`absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-r from-transparent to-gray-800`} />
				{selected.map((d: string) => {
					const option = field.options.find(o => o.id === d);
					return <span key={d} class={tw`bg-gray-700 rounded text-xs
						text-gray-100 font-bold px-2 py-1 whitespace-pre`}>
						{option?.shortName ?? option?.label ?? d}
					</span>
				})}
			</div>;
		}
		default:
			return <p>UNKNOWN</p>
	}
}
