import { usePageContext } from 'pages';
import { Elements } from 'elements-base';
import { Static, hydrate } from 'hydrated';
import { ComponentChildren, h } from 'preact';
import { useMemo, useRef, useState } from 'preact/hooks';

import { Components } from './field';
import { ClientFieldProps, ClientLayoutProps } from '../Type';

const { Text: { component: Text }, HTML: { component: HTML } } = ('window' in globalThis) ?
	{ Text: { component: () => null }, HTML: { component: () => null } }: Elements;
const { getForm } = (('window' in globalThis) ? { getForm: () => ({}) } : require('../server/Database')) as
	typeof import('../server/Database');

const identifier = 'forms:form';

interface ClientProps {
	id: number;
	fields: ClientFieldProps[];
	layout: ClientLayoutProps[];

	gap?: [ number, number ];
	columns?: number;
	children?: ComponentChildren;
}

interface ServerProps {
	id: number;
	columns?: number;
	gap?: [ number, number ];
	layout?: ClientLayoutProps[];
	children?: ComponentChildren;
}

type Props = ClientProps | ServerProps;

export function RawForm(props: Props) {
	const pageContext = usePageContext();

	const [ state, setState ] = useState<'input' | 'submitting' | 'submitted' | 'submitted_hidden'>(
		(pageContext ? pageContext.query?.submitted : new URLSearchParams(window.location.search).get('submitted'))
		=== 'true' ? 'submitted_hidden' : 'input');
		const [ error, setError ] = useState<string | null>(
			(pageContext ? pageContext.query?.error : new URLSearchParams(window.location.search).get('error')) ?? null);

	const formRef = useRef<HTMLFormElement>(null);
	const statusRef = useRef<HTMLDivElement>(null);
	const childArr = Array.isArray(props.children) ? props.children : props.children ? [ props.children ] : [];

	const formProps: Omit<ClientProps, 'children'> = useMemo(() => {
		if (!('fields' in props) || !('layout' in props)) {
			const form = getForm(props.id)!;
			return {
				id: props.id,
				fields: form.fields,
				columns: props.columns ?? form.client.columns,
				gap: props.gap ?? form.client.gap,
				layout: props.layout ?? form.client.layout!,
			};
		}
		return props;
	}, [ props ]);

	async function handleSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();

		const formElem = (evt.target as HTMLFormElement);

		const formData = new FormData(formElem);
		formData.set('#fetch#', 'true');

		setState('submitting');
		const loadStart = Date.now();

		const res = await fetch('/form/submit', {
			method: 'POST',
			body: formData,
			cache: 'no-cache',
		});

		const timeDiff = Date.now() - loadStart;
		if (timeDiff < 500) await new Promise(resolve => setTimeout(resolve, 500 - timeDiff));

		if (res.status === 200) {
			setState('submitted');
			setError(null);
			setTimeout(() => {
				formElem.style.height = `${formElem.offsetHeight}px`;
				setTimeout(() => formElem.style.height = '0px', 50);
				setTimeout(() => setState('submitted_hidden'), 500);
			}, 300);
		}
		else {
			setError(await res.text());
			setState('input');
		}

		setTimeout(() => statusRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
	}

	return (
		<div class={identifier}>
			{(state === 'submitted' || state === 'submitted_hidden') &&
				<div ref={statusRef} id={`form-${props.id}-submitted`} class='forms:form-submitted'>
					<p class='title'>Form submitted successfully.</p>
				</div>
			}

			{error != null &&
				<div ref={statusRef} key={error} id={`form-${props.id}-error`} class='forms:form-error'>
					<p class='title'>Form submission failed.</p>
					<p class='description'>{error}</p>
				</div>
			}

			{state !== 'submitted_hidden' && <form
				ref={formRef}
				class={
					`forms:form-form ${state === 'submitting' ? 'submitting' : ''} ${state === 'submitted' ? 'submitted' : ''}`}
				method='post'
				action='/form/submit'
				style={{
					display: 'grid',
					rowGap: formProps.gap?.[0] ?? 0,
					columnGap: formProps.gap?.[1] ?? 0,
					gridTemplateColumns: `repeat(${formProps.columns ?? 1}, 1fr)`
				}}
				onSubmit={handleSubmit}
				// eslint-disable-next-line
				// @ts-ignore
				inert={state !== 'input'}
			>
				<Static>
					<input type='hidden' name='#form_id#' value={formProps.id}/>
					<input type='hidden' name='#return_path#' value={pageContext?.path ?? ''}/>
					<input type='email' autoComplete='nothx' id='#email#' name='#email#' tabIndex={-1}/>
				</Static>
				{formProps.layout.map((layout, ind) => {
					switch (layout.id) {
						default: {
							const field = formProps.fields.find(field => field.id === layout.id);
							if (!field) return <p>UNKNOWN FIELD {layout.id}</p>;
							const Component = Components[field.type ?? "text"];
							return <Component layout={layout} field={field} />;
						}
						case "#text":
							return <Static key={`${layout.id}_${ind}`}><Text content={(layout as any).content} /></Static>;
						case "#submit":
							return <button key={`${layout.id}_${ind}`} type='submit'><span>{(layout as any).label}</span></button>;
						case "#element":
							return <Static key={layout.id} class='forms:form-element'>{childArr[(layout as any).index] ?? null}</Static>;
						case "#html":
							return <Static key={`${layout.id}_${ind}`}><HTML html={(layout as any).html} /></Static>;
						case "#space":
							return <div style={{ width: (layout as any).width, height: (layout as any).height }} />;
					}
				})}
			</form>}
		</div>
	)
}

export const Form = hydrate<Props>(identifier, RawForm, (props) => {
	const form = getForm(props.id)!;
	const newProps: ClientProps = {
		id: props.id,
		fields: form.fields,
		columns: props.columns ?? form.client.columns,
		gap: props.gap ?? form.client.gap,
		layout: props.layout ?? form.client.layout!,
	};
	return newProps;
});

export default { identifier, component: Form };
