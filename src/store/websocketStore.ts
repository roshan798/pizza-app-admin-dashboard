/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';
import type { Order } from '../http/Orders/order-types';
import { Events, OrderEvents } from '../types/socketEvents';

// TODO
//
interface WebSocketState {
	socket: Socket | null;
	isConnected: boolean;
	orders: Order[];
	connect: (tenantId: string) => void;
	disconnect: () => void;
	addOrder: (order: Order) => void;
	updateOrder: (orderId: string, updates: Partial<Order>) => void;
	setOrders: (orders: Order[]) => void;
}

export interface WebSocketMessage<T, V> {
	event_type: T;
	data: V;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	socket: null,
	isConnected: false,
	orders: [],

	connect: (tenantId: string) => {
		console.log(
			'🔌 [WebSocketStore] connect() called with tenantId:',
			tenantId
		);

		const { socket } = get();
		console.log('🔌 [WebSocketStore] Current socket state:', {
			hasSocket: !!socket,
			isConnected: socket?.connected,
		});

		// Disconnect existing socket first
		if (socket) {
			console.log('🔌 [WebSocketStore] Disconnecting existing socket...');
			socket.disconnect();
		}

		// Create new socket connection for tenant
		const wsUrl =
			`${import.meta.env.VITE_WEBSOCKET_URL}` || 'http://localhost:8084';
		// console.log(
		// 	'[WebSocketStore] Creating new socket connection to:',
		// 	wsUrl
		// );

		const newSocket = io(wsUrl, {
			transports: ['websocket'],
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			timeout: 20000,
		});

		newSocket.on(Events.CONNECT, () => {
			newSocket.emit(Events.JOIN, {
				tenantId,
			});
			set({ isConnected: true });
		});

		newSocket.on(Events.ERROR, (error) => {
			console.error(
				'[WebSocketStore] CONNECT_ERROR:',
				error.message || error
			);
			console.error('[WebSocketStore] Full error object:', error);
		});

		newSocket.on('disconnect', (reason) => {
			// console.log('[WebSocketStore] DISCONNECTED. Reason:', reason);
			set({ isConnected: false });
		});

		newSocket.on('reconnect', (attemptNumber) => {
			// console.log(
			// 	'🔄 [WebSocketStore] RECONNECTED after',
			// 	attemptNumber,
			// 	'attempts'
			// );
			set({ isConnected: true });
		});

		newSocket.on('reconnect_attempt', (attemptNumber) => {
			// console.log(
			// 	'[WebSocketStore] Reconnection attempt #',
			// 	attemptNumber
			// );
		});

		newSocket.on('reconnect_error', (error) => {
			console.error(
				'[WebSocketStore] RECONNECTION ERROR:',
				error.message || error
			);
		});

		newSocket.on('reconnect_failed', () => {
			console.error(
				'[WebSocketStore] RECONNECTION FAILED - Max attempts reached'
			);
			set({ isConnected: false });
		});

		// Order events from Kafka via WebSocket service
		newSocket.on(
			Events.ORDER_UPDATE,
			(message: WebSocketMessage<string, Order>) => {
				console.log({ message });
				const order = message.data;
				if (message.event_type === OrderEvents.ORDER_CREATE) {
					console.log(
						'[WebSocketStore] New order created:',
						message.data.id
					);
				} else if (message.event_type === OrderEvents.ORDER_UPDATE) {
					// console.log(
					// 	'[WebSocketStore] Order updated:',
					// 	message.data.id
					// );
					set((state) => {
						const updatedOrders = state.orders.map((o) =>
							o.id === order.id ? order : o
						);
						console.log(
							'[WebSocketStore] Order updated in store. Found:',
							updatedOrders.some((o) => o.id === order.id)
						);
						return { orders: updatedOrders };
					});
				} else if (
					message.event_type === OrderEvents.ORDER_STATUS_UPDATE
				) {
					console.log(
						'[WebSocketStore] Order status updated:',
						message.data.id
					);
					set((state) => {
						const updatedOrders = state.orders.map((o) =>
							o.id === order.id ? order : o
						);
						// console.log(
						// 	'[WebSocketStore] Status updated for order:',
						// 	order.id
						// );
						return { orders: updatedOrders };
					});
				}

				set((state) => {
					const newOrders = [message.data, ...state.orders];
					return { orders: newOrders };
				});
			}
		);

		newSocket.on('orderUpdated', (order: Order) => {
			console.log('[WebSocketStore] orderUpdated event received:', {
				orderId: order.id,
				oldStatus: get().orders.find((o) => o.id === order.id)
					?.orderStatus,
				newStatus: order.orderStatus,
			});
			set((state) => {
				const updatedOrders = state.orders.map((o) =>
					o.id === order.id ? order : o
				);
				// console.log(
				// 	'[WebSocketStore] Order updated in store. Found:',
				// 	updatedOrders.some((o) => o.id === order.id)
				// );
				return { orders: updatedOrders };
			});
		});

		newSocket.on('orderStatusChanged', (order: Order) => {
			// console.log('[WebSocketStore] orderStatusChanged event:', {
			// 	orderId: order.id,
			// 	tenantId: order.tenantId,
			// 	from: get().orders.find((o) => o.id === order.id)?.orderStatus,
			// 	to: order.orderStatus,
			// });
			set((state) => {
				const updatedOrders = state.orders.map((o) =>
					o.id === order.id ? order : o
				);
				console.log(
					'[WebSocketStore] Status updated for order:',
					order.id
				);
				return { orders: updatedOrders };
			});
		});

		// Generic message handler for debugging
		newSocket.on('message', (data) => {
			console.log('📨 [WebSocketStore] Generic message received:', data);
		});

		console.log('🔌 [WebSocketStore] All event listeners attached');
		set({ socket: newSocket });
		console.log('✅ [WebSocketStore] Socket stored in zustand state');
	},

	disconnect: () => {
		console.log('🔌 [WebSocketStore] disconnect() called');
		const { socket } = get();
		if (socket) {
			console.log('🔌 [WebSocketStore] Closing socket connection...');
			socket.disconnect();
			console.log('🔌 [WebSocketStore] Socket disconnected');
		} else {
			console.log('🔌 [WebSocketStore] No socket to disconnect');
		}
		set({ socket: null, isConnected: false });
		console.log('✅ [WebSocketStore] Store cleaned up');
	},

	addOrder: (order: Order) => {
		console.log('➕ [WebSocketStore] addOrder() called for:', order.id);
		console.log(
			'➕ [WebSocketStore] Current orders count:',
			get().orders.length
		);
		set((state) => {
			const newOrders = [order, ...state.orders];
			console.log(
				'➕ [WebSocketStore] Added order. New count:',
				newOrders.length
			);
			return { orders: newOrders };
		});
	},

	updateOrder: (orderId: string, updates: Partial<Order>) => {
		console.log('🔄 [WebSocketStore] updateOrder() called:', {
			orderId,
			updates,
		});
		console.log(
			'🔄 [WebSocketStore] Current orders matching ID:',
			get().orders.filter((o) => o.id === orderId).length
		);
		set((state) => {
			const updatedOrders = state.orders.map((order) =>
				order.id === orderId ? { ...order, ...updates } : order
			);
			console.log('🔄 [WebSocketStore] Order updated in store');
			return { orders: updatedOrders };
		});
	},

	setOrders: (orders: Order[]) => {
		console.log(
			'📋 [WebSocketStore] setOrders() called with',
			orders.length,
			'orders'
		);
		set({ orders });
		console.log('✅ [WebSocketStore] Orders array replaced in store');
	},
}));
