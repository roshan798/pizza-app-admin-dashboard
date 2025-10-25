import type { ServerError } from '../types';

type ErrorResponse = {
	errors?: ServerError[];
	message?: string;
};

export const mapServerFormErrors = (
	data?: ErrorResponse
): Record<string, string> => {
	if (!data) {
		return { general: 'Something went wrong, please try again later.' };
	}

	// Case 1: structured errors array
	if (data.errors && data.errors.length > 0) {
		return data.errors.reduce<Record<string, string>>((acc, err) => {
			if (err.path) {
				acc[err.path] = err.msg;
			} else {
				acc.general = err.msg;
			}
			return acc;
		}, {});
	}

	// Case 2: generic message
	if (data.message) {
		return { general: data.message };
	}

	// Fallback
	return { general: 'Something went wrong, please try again later.' };
};

export const toDateTime = (date?: string, showTime: boolean = true) => {
	if (!date) return '-';
	return new Date(date).toLocaleString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: showTime ? '2-digit' : undefined,
		minute: showTime ? '2-digit' : undefined,
	});
};
