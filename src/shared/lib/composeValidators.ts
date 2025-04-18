type ValidatorType = (a: string) => string;

const composeValidators =
	(...validators: ValidatorType[]) =>
	(value: string) =>
		validators.reduce(
			(error: string | undefined, validator) => error || validator(value),
			undefined,
		);

export default composeValidators;
