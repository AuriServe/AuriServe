import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import { mergeClasses } from 'common/util';

interface Props {
	style?: any;
	class?: string;
}

export default forwardRef<HTMLHRElement, Props>(function InputLabel(props, fRef) {
	return <hr ref={fRef} class={mergeClasses(props.class, 'border-b border-gray-700 my-4')} />;
});
