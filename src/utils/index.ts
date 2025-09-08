import type { ServerError } from '../types';

export const mapServerFormErrors = (
	errors?: ServerError[]
): Record<string, string> => {
	if (!errors)
		return { general: 'Something went wrong, please try again later.' };

	return errors.reduce<Record<string, string>>((acc, err) => {
		if (err.path) {
			acc[err.path] = err.msg;
		} else {
			acc.general = err.msg;
		}
		return acc;
	}, {});
};
