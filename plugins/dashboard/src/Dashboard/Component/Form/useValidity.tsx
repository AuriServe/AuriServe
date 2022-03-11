import { FormContext } from './Types';
import { useContext, useState } from 'preact/hooks';

type CheckCtx<Ctx extends Record<string, unknown>, Value> = Ctx & {
	value: Value;
};

type ValidityErrorSeverity = 'submit' | 'blur' | 'change';

export interface ValidityError {
	message: string;
	severity: ValidityErrorSeverity;
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
	validate: (value: Value) => ValidityError | null;
}

export default function useValidity<
	Value,
	Ctx extends Record<string, unknown> = Record<string, never>
>(options: UseValidityOptions<Value, Ctx>): UseValidityResult<Value> {
	const formCtx = useContext(FormContext);
	const [error, setError] = useState<ValidityError | null>(null);
	// const [ showError, setShowError] = useState<ValidityError | null>

	const validate = (value: Value) => {
		const ctx = { ...options.context, value };
		const check = options.checks.find((check) => check.condition(ctx));
		const error = check
			? ({
					message: typeof check.message === 'string' ? check.message : check.message(ctx),
					severity: check.severity || 'blur',
			  } as ValidityError)
			: null;

		setError((lastError) => {
			// Don't rerender the component if the errors are identical.
			const newError =
				error &&
				lastError &&
				error.message === lastError.message &&
				error.severity === lastError.severity
					? lastError
					: error;

			options.onValidityChange?.(newError);
			formCtx.event.emit('validity', options.path, newError);

			return newError;
		});

		return error;
	};

	return {
		error,
		invalid: false,
		validate,
	};
}
