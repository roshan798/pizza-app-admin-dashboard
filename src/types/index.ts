
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

export type Roles = 'manager' | 'admin' | 'customer';
