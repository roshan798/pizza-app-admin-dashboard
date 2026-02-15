export const PaymentStatus = {
	PAID: 'PAID',
	UNPAID: 'UNPAID',
	NO_PAYMENT_REQUIRED: 'NO_PAYMENT_REQUIRED',
	PENDING: 'PENDING',
} as const;

export const PaymentMode = {
	CASH: 'CASH',
	CARD: 'CARD',
} as const;

export const OrderStatus = {
	PENDING: 'pending',
	VERIFIED: 'verified',
	CONFIRMED: 'confirmed',
	PREPARING: 'preparing',
	OUT_FOR_DELIVERY: 'out-for-delivery',
	DELIVERED: 'delivered',
	CANCELLED: 'cancelled',
} as const;

export interface Order {
	id: string;
	customerId: string;
	address: string;
	phone: string;
	paymentMode: keyof typeof PaymentMode;
	paymentStatus: keyof typeof PaymentStatus;
	couponCode: string;
	amounts: Amounts;
	orderStatus: (typeof OrderStatus)[keyof typeof OrderStatus];
	tenantId: string;
	createdAt: string;
	updatedAt: string;
	items: Item[];
}

export interface Amounts {
	subTotal: number;
	tax: number;
	deliveryCharge: number;
	discount: number;
	grandTotal: number;
	_id: string;
}

export interface Item {
	base: PriceConf;
	productId: string;
	productName: string;
	quantity: number;
	toppings: Topping[];
	itemTotal: number;
	_id: string;
}

export interface PriceConf {
	name: string;
	price: number;
}

export interface Topping {
	id: string;
	price: number;
	_id: string;
}

////////////
export interface OrderResponse {
	data: Order[];
	total: number;
	page: number;
	limit: number;
}
