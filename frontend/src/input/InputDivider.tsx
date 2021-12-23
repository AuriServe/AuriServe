import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import { merge } from 'common/util';

interface Props {
	style?: any;
	class?: string;
}

export default forwardRef<HTMLHRElement, Props>(function InputLabel(props, fRef) {
	return <hr ref={fRef} class={merge(props.class, 'border-b border-neutral-200 my-4')} />;
});
