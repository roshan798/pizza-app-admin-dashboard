export const Events = {
	CONNECTION: 'connection',
	JOIN: 'join',
	ERROR: 'connect_error',
	ORDER_UPDATE: 'order_update',
	CONNECT: 'connect',
	DISCONNECT: 'disconnect',
	RECONNECT: 'reconnect',
} as const;

export const OrderEvents = {
	ORDER_CREATE: 'order_create',
	ORDER_UPDATE: 'order_update',
	ORDER_STATUS_UPDATE: 'order_status_update',
	ORDER_PAYMENT_STATUS_UPDATE: 'order_payment_status_update',
} as const;
