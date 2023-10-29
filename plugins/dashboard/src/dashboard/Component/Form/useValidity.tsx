import { useContext, useState } from 'preact/hooks';

import { FormContext } from './Form';

type CheckCtx<Ctx extends Record<string, unknown>, Value> = Ctx & {
	value: Value | null;
};

type ValidityErrorSeverity = 'submit' | 'blur' | 'change';

export interface ValidityError {
	message: string;
	severity: ValidityErrorSeverity;
	visible?: boolean;
}

interface ValidityCheck<Ctx> {
	condition: (ctx: Ctx) => any;
	message: string | ((ctx: Ctx) => string);
	severity?: ValidityErrorSeverity;
}

interface UseValidityOptions<Value, Ctx extends Record<string, unknown>> {
	path: string;
	context: Ctx;
	checks: ValidityCheck<CheckCtx<Ctx, Value>>[];

	onValidityChange?: (error: ValidityError | null) => void;
}

interface UseValidityResult<Value> {
	readonly error: ValidityError | null;
	readonly invalid: boolean;

	onBlur: () => void;
	validate: (value: Value | null) => ValidityError | null;
}

function isSameError(a: ValidityError | null, b: ValidityError | null): boolean {
	if (!a && !b) return true;
	if (!a || !b) return false;
	return a.message === b.message && a.severity === b.severity && a.visible === b.visible;
}

export default function useValidity<
	Value,
	Ctx extends Record<string, unknown> = Record<string, never>
>(options: UseValidityOptions<Value, Ctx>): UseValidityResult<Value> {
	const formCtx = useContext(FormContext);
	const [error, setError] = useState<ValidityError | null>(null);
	const invalid = error?.visible ?? false;

	if (!formCtx) return {
		error: null,
		invalid: false,
		onBlur: () => {/**/},
		validate: () => null
	};

	const validate = (value: Value | null) => {
		const ctx = { ...options.context, value };
		const check = options.checks.find((check) => check.condition(ctx));
		setError((lastError) => {
			const error = check
				? ({
						message:
							typeof check.message === 'string' ? check.message : check.message(ctx),
						severity: check.severity || 'blur',
						visible: check.severity === 'change' ? true : lastError?.visible,
				  } as ValidityError)
				: null;

			const newError = isSameError(lastError, error) ? lastError : error;

			options.onValidityChange?.(newError);
			formCtx.event.emit('validity', options.path, newError);

			return newError;
		});

		return error;
	};

	const onBlur = () => {
		setError((lastError) => {
			const error = !lastError
				? null
				: {
						...lastError,
						visible: lastError.severity === 'blur' ? true : lastError.visible,
				  };
			formCtx.event.emit('validity', options.path, error);
			return isSameError(lastError, error) ? lastError : error;
		});
	};

	formCtx.event.bind('submit', () => {
		setError((lastError) => {
			const error = !lastError ? null : { ...lastError, visible: true };
			formCtx.event.emit('validity', options.path, error);
			return isSameError(lastError, error) ? lastError : error;
		});
	});

	return {
		error,
		invalid,
		validate,
		onBlur,
	};
}
