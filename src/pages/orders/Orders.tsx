import { Spin, Alert } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import OrdersHeader from './components/OrdersHeader';
import OrdersTable from './components/OrdersTable';
import { useOrders } from '../../hooks/useOrders';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useWebSocketStore } from '../../store/websocketStore';
import type { Order } from '../../http/Orders/order-types';
import { useNotification } from '../../hooks/useNotification';
import OrdersFilters from './components/OrdersFilters ';

const Orders = () => {
	const notify = useNotification();
	const {
		orders: apiOrders,
		loading: apiLoading,
		total,
		page,
		limit,
		paymentStatus,
		orderStatus,
		searchQuery,
		handleSearch,
		handlePaymentFilter,
		handleStatusFilter,
		handlePagination,
		handlePageSize,
	} = useOrders();

	const { orders: liveOrders, isConnected } = useWebSocket();
	const { setOrders } = useWebSocketStore();

	// Track previous live orders for change detection
	const prevLiveOrdersRef = useRef<Order[]>([]);

	useEffect(() => {
		const prevOrders = prevLiveOrdersRef.current;
		prevLiveOrdersRef.current = liveOrders;

		// Check for NEW or UPDATED orders
		liveOrders.forEach((liveOrder) => {
			const prevOrder = prevOrders.find((o) => o.id === liveOrder.id);

			// NEW order (not in previous list)
			if (!prevOrder) {
				// notify('success', 'New Order Received!',
				// 	`Order #${liveOrder.id.slice(-8)} - ${liveOrder.orderStatus}`
				// );
				return;
			}

			// STATUS CHANGED
			if (prevOrder.orderStatus !== liveOrder.orderStatus) {
				notify(
					'info',
					`Order #${liveOrder.id.slice(-8)} Updated`,
					`Status: ${prevOrder.orderStatus} → ${liveOrder.orderStatus}`
				);
			}

			// PINNED TO TOP (not on current API page)
			// const isPinned = !apiOrders?.some(apiOrder => apiOrder.id === liveOrder.id);
			// if (isPinned && prevOrder.orderStatus === liveOrder.orderStatus) {
			// 	notify('warning', 'Live Update!',
			// 		`Order #${liveOrder.id.slice(-8)} moved to top`
			// 	);
			// }
		});
	}, [liveOrders, apiOrders, notify]);

	// Enhanced displayOrders with pinning
	const displayOrders = useMemo(() => {
		if (!apiOrders?.length) return liveOrders;

		// Pinned live orders (NEW/OFF-PAGE → TOP)
		const pinnedLiveOrders = liveOrders.filter(
			(liveOrder) =>
				!apiOrders.some((apiOrder) => apiOrder.id === liveOrder.id)
		);

		// Current page with live overlay
		const pageOrders = apiOrders
			.map(
				(apiOrder) =>
					liveOrders.find((live) => live.id === apiOrder.id) ||
					apiOrder
			)
			.filter(Boolean);

		console.log(
			'📊 [Orders] Pinned:',
			pinnedLiveOrders.length,
			'Page:',
			pageOrders.length
		);
		return [...pinnedLiveOrders, ...pageOrders];
	}, [apiOrders, liveOrders]);

	const isLoading = apiLoading || (!apiOrders?.length && !liveOrders.length);

	// Sync API to WebSocket store
	useEffect(() => {
		if (apiOrders && apiOrders.length > 0) {
			console.log(
				'📊 [Orders] Syncing API orders to WebSocket store:',
				apiOrders.length
			);
			setOrders(apiOrders);
		}
	}, [apiOrders, setOrders]);

	// Connection status
	const connectionStatus = (
		<Alert
			message={`Live Orders: ${isConnected ? '🟢 Connected' : '🔴 Offline'}`}
			type={isConnected ? 'success' : 'warning'}
			showIcon
			style={{ marginBottom: 16 }}
		/>
	);

	return (
		<div>
			<OrdersHeader />
			{connectionStatus}

			<OrdersFilters
				paymentStatus={paymentStatus}
				orderStatus={orderStatus}
				searchQuery={searchQuery}
				onSearch={handleSearch}
				onPaymentFilter={handlePaymentFilter}
				onStatusFilter={handleStatusFilter}
			/>

			{isLoading ? (
				<Spin
					size="large"
					tip="Loading orders..."
					style={{ display: 'block', margin: '100px auto' }}
				/>
			) : displayOrders.length ? (
				<OrdersTable
					orders={displayOrders}
					loading={false}
					total={total || displayOrders.length}
					page={page}
					limit={limit}
					onPagination={handlePagination}
					onPageSize={handlePageSize}
				/>
			) : (
				<div style={{ textAlign: 'center', padding: '100px 50px' }}>
					<Spin size="default" />
					<p style={{ marginTop: 16 }}>No orders found</p>
				</div>
			)}
		</div>
	);
};

export default Orders;
