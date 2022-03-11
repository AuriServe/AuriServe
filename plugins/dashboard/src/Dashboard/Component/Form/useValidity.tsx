type CheckCtx<Ctx extends Record<string, unknown>, Value> = Ctx & {
	value: Value;
};

type ValidityErrorSeverity = 'submit' | 'blur' | 'change';

export interface ValidityError {
	message: string;
	severity: ValidityErrorSeverity;
}

interface ValidityCheck<Value, Ctx> {
	condition: (ctx: Ctx) => boolean;
	message: string | ((ctx: Ctx) => string);
	severity?: ValidityErrorSeverity;
}

interface UseValidityOptions<Value, Ctx extends Record<string, unknown>> {
	context: Ctx;
	checks: ValidityCheck<Value, CheckCtx<Ctx, Value>>[];
}

interface UseValidityResult<Value> {
	updateValidity: (value: Value) => ValidityError | null;
}

export default function useValidity<Value, Ctx extends Record<string, unknown>>(
	options: UseValidityOptions<Value, Ctx>
): UseValidityResult<Value> {
	const updateValidity = (value: Value) => {
		const ctx = { ...options.context, value };
		const check = options.checks.find((check) => check.condition(ctx));
		const error = check
			? ({
					message: typeof check.message === 'string' ? check.message : check.message(ctx),
					severity: check.severity || 'blur',
			  } as ValidityError)
			: null;

		return error;
	};

	return {
		updateValidity,
	};
}
