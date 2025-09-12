export type ServerError = {
	type: string;
	value?: string;
	msg: string;
	path?: string;
	location?: string;
};

export type ErrorResponse = {
	success: boolean;
	message: string;
	errors?: ServerError[];
};
export interface ApiError {
	response?: {
		data?: {
			errors?: ServerError[];
			message?: string;
		};
	};
	message?: string;
}

export type Roles = 'manager' | 'admin' | 'customer';

// Generic type for success response
export type SuccessResponse = {
	success: boolean;
	message: string;
};
