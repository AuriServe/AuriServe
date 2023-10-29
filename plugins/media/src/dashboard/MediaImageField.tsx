import { h } from 'preact';
import { useAsyncMemo, useStore } from 'vibin-hooks';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { FieldContainer, FieldProps, useDerivedState, useValidity,
	tw, merge, useClasses, LinkButton, Button, Icon, Svg, executeQuery } from 'dashboard';

import { QUERY_GET_MEDIA_BY_ID } from './Graph';
import MediaImageChooser from './MediaImageChooser';
import { getThumbnail } from './Util';

type Props = FieldProps<number> & {
	hideLabel?: boolean;
	aspect?: number;
};

export default function MediaImageField(props: Props) {
	// const ref = useRef<HTMLElement>(null);
	const classes = useClasses(props.class);

	const draggedOver = useStore(false);
	const choosingExisting = useStore(false);
	const dragTargetRef = useRef<HTMLDivElement>(null);

	const {
		value,
		setValue,
		id,
		path,
		label,
		disabled,
		readonly,
		required,
		onFocus,
		onBlur: stateOnBlur,
		onRef
	} = useDerivedState<number>(props, -1, false);

	const media = useAsyncMemo(async (abort) => {
		if (!value.current || value.current < 0) return;
		const media = (await executeQuery(QUERY_GET_MEDIA_BY_ID, { id: value.current })).media.mediaById;
		if (abort.aborted) return;
		return media;
	}, [ value.current ]);

	const {
		validate,
		onBlur: validityOnBlur,
		invalid,
	} = useValidity<number>({
		path,
		context: {},
		checks: [
			{
				condition: ({ value }) => required && value === -1,
				message: 'This field is required.',
			},
		],
		onValidityChange: props.onValidity,
	});

	useLayoutEffect(() => void validate(value.current), [ validate, value ]);

	// const handleChange = ({ target }: any) => {
	// 	// const newValue: boolean = target.checked;
	// 	// value.current = newValue;
	// 	// validate(newValue);
	// 	// props.onChange?.(newValue);
	// 	// ctx.event.emit('change', path, newValue);
	// };

	const handleUpload = () => {
		console.log('upload');
	}

	const handleBlur = (evt: Event) => {
		validityOnBlur();
		stateOnBlur(evt);
	};

	function handleEdit() {
		choosingExisting(true);
	}12

	function handleClear() {
		console.warn('unimplemented');
		setValue(-1);
	}

	function handleView() {
		console.warn('unimplemented');
	}

	return (
		<FieldContainer
			disabled={disabled}
			hideLabel={props.hideLabel}
			label={label}
			labelId={id}
			invalid={invalid}
			class={merge(tw`bg-gray-(${draggedOver() ? '700' : '750'}) hover:bg-gray-input rounded transition`, classes.get())}
			style={props.style}>
			{value.current === -1
				? <div
						ref={dragTargetRef}
						class={tw`p-2.5 mt-4 aspect-[${props.aspect}] flex-(& col) items-center justify-center`}
						onDragEnter={() => draggedOver(true)}
						onDragLeave={(evt) => (!dragTargetRef.current!.contains(evt.relatedTarget as any)) && draggedOver(false)}
					>
						<Svg src={Icon.image} size={8}
							class={tw`icon-(${draggedOver() ? 'p-gray-200 s-gray-500' : 'p-gray-300 s-gray-500/70'})
								transition duration-200 ${draggedOver() && 'scale-150 translate-y-2'}`}/>
						<p class={tw`p-3 py-1 text-(sm gray-300/80 center) font-medium mx-auto
							w-full max-w-sm mb-2.5 transition select-none
							${draggedOver() ? 'opacity-0 translate-y-1' : 'delay-100'}`}>
							Drag an image here to <LinkButton onClick={handleUpload} label='upload' class={tw`dark:text-accent-300/80`}/> it, <wbr/>
							or&nbsp;select an <LinkButton label='existing image' class={tw`dark:text-accent-300/80`}/>.
						</p>
						<p class={tw`p-3 py-1 text-(gray-300 center) font-medium mx-auto
							w-full max-w-sm mb-2.5 -mt-10 transition interact-none
							${!draggedOver() ? 'opacity-0 -translate-y-1.5' : 'delay-100'}`}>
							Drop here to upload.
						</p>
					</div>
				: <div class={tw`p-2.5 mt-4 aspect-[${props.aspect}] grid`}>
						<div class={tw`grid`}>
							<div class={tw`bg-cover bg-center rounded shadow-(md black/20) row-start-1 col-start-1
								peer opacity-70 group-hocus:opacity-90 transition`}
								style={{ backgroundImage: media ? `url(/media/${getThumbnail(media, 256).path})` : null }}/>
							<div class={tw`bg-gray-800/50 backdrop-blur-md shadow-(md black/20) transition
								row-start-1 col-start-1 w-max h-max place-self-center flex p-1.5 rounded-lg
								scale-[98%] opacity-0 group-hocus:(opacity-100 scale-100)`}>
								<Button.Ghost onClick={handleEdit} size={8.5} label='Change'
									iconOnly icon={Icon.edit} class={tw`text-sm`}/>
								<Button.Ghost onClick={handleClear} size={8.5} label='Delete'
									iconOnly icon={Icon.trash} class={tw`text-sm`}/>
								<Button.Ghost onClick={handleView} size={8.5} label='View'
									iconOnly icon={Icon.external} class={tw`text-sm`}/>
							</div>
						</div>
					</div>
			}
			<MediaImageChooser
				active={choosingExisting()}
				current={value.current}
				onClose={() => choosingExisting(false)}/>
		</FieldContainer>
	);
}
