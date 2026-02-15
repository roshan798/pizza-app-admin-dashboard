import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
	Alert,
	Spin,
	Typography,
	Row,
	Col,
	Space,
	Button,
	message,
	Modal,
	Select,
} from 'antd';
import { OrderStatus, type Order } from '../../http/Orders/order-types';
import {
	cancelOrder,
	fetchOrderById,
	updateOrderStatus,
} from '../../http/Orders/orders';
import { AxiosError } from 'axios';
import OrderNotFound from './components/OrderNotFound';
import OrderStatusOverviewCard from './components/OrderStatusOverviewCard';
import OrderItemsListCard from './components/OrderItemsListCard';
import OrderDeliveryDetailsCard from './components/OrderDeliveryDetailsCard';
import OrderSummaryTotalsCard from './components/OrderSummaryTotalsCard';

const { Title } = Typography;
const { Option } = Select;

const OrderDetailPage = () => {
	const params = useParams();
	const orderId = params.id as string;
	// const { user } = useAuthStore(); // Get user from auth store
	// const userRole = user?.role; // Assuming user object has a role property

	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadOrder = async () => {
			setLoading(true);
			setError(null);
			try {
				const fetchedOrder = await fetchOrderById(orderId);
				const order = fetchedOrder.data as Order;
				setOrder(order);
			} catch (err) {
				if (
					err instanceof AxiosError &&
					err.response &&
					err.response.status === 404
				) {
					setError('Order not found');
				} else {
					setError(
						'Failed to fetch order details. Please try again.'
					);
					console.error('Error fetching order:', err);
				}
			} finally {
				setLoading(false);
			}
		};

		if (orderId) {
			loadOrder();
		}
	}, [orderId]);

	// State for action buttons
	const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
		useState(false);
	const [selectedNewStatus, setSelectedNewStatus] = useState<
		Order['orderStatus'] | undefined
	>(undefined);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
	const [isCancellingOrder, setIsCancellingOrder] = useState(false);

	const handleUpdateStatusClick = () => {
		setIsUpdateStatusModalVisible(true);
		setSelectedNewStatus(order?.orderStatus); // Pre-select current status
	};

	const handleCancelOrderClick = () => {
		setIsCancelModalVisible(true);
	};

	const confirmUpdateStatus = async () => {
		if (!order || !selectedNewStatus) return;

		setIsUpdatingStatus(true);
		try {
			const response = await updateOrderStatus(
				order.id,
				selectedNewStatus
			);
			const updatedOrder = response.data as Order;
			setOrder(updatedOrder);
			message.success(`Order status updated to ${selectedNewStatus}`);
			setIsUpdateStatusModalVisible(false);
		} catch (err) {
			if (
				err instanceof AxiosError &&
				err.response &&
				err.response.status === 400
			)
				message.error(
					err.response?.data?.message ||
						'Failed to update order status.'
				);
			else {
				message.error(
					'Failed to update order status. Please try again.'
				);
			}
			console.error('Error updating order status:', err);
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const confirmCancelOrder = async () => {
		if (!order) return;

		setIsCancellingOrder(true);
		try {
			const response = await cancelOrder(order.id);
			const updatedOrder = response.data as Order;
			setOrder(updatedOrder);
			message.success('Order cancelled successfully.');
			setIsCancelModalVisible(false);
		} catch (err) {
			if (
				err instanceof AxiosError &&
				err.response &&
				err.response.status === 400
			)
				message.error(
					err.response?.data?.message ||
						'Failed to update order status.'
				);
			else {
				message.error('Failed to Cancel order. Please try again.');
			}
			console.error('Error cancelling order:', err);
		} finally {
			setIsCancellingOrder(false);
		}
	};

	// Determine available next statuses based on current status
	const availableStatusOptions = useMemo(() => {
		if (!order) return [];
		const currentStatus = order.orderStatus;
		// const allStatuses = Object.values(OrderStatus);

		// Define the valid transitions (simplified for example)
		const transitions: Record<
			Order['orderStatus'],
			Order['orderStatus'][]
		> = {
			[OrderStatus.PENDING]: [
				OrderStatus.VERIFIED,
				OrderStatus.CANCELLED,
			],
			[OrderStatus.VERIFIED]: [
				OrderStatus.CONFIRMED,
				OrderStatus.CANCELLED,
			],
			[OrderStatus.CONFIRMED]: [
				OrderStatus.PREPARING,
				OrderStatus.CANCELLED,
			],
			[OrderStatus.PREPARING]: [
				OrderStatus.OUT_FOR_DELIVERY,
				OrderStatus.CANCELLED,
			],
			[OrderStatus.OUT_FOR_DELIVERY]: [
				OrderStatus.DELIVERED,
				OrderStatus.CANCELLED,
			],
			[OrderStatus.DELIVERED]: [], // Cannot change after delivered
			[OrderStatus.CANCELLED]: [], // Cannot change after cancelled
		};

		// // Admins can potentially set any status (except delivered/cancelled to something else)
		// if (userRole === 'ADMIN') {
		//     return allStatuses.filter(status =>
		//         status !== OrderStatus.DELIVERED && status !== OrderStatus.CANCELLED
		//     );
		// }

		// Managers follow transitions
		return transitions[currentStatus] || [];
	}, [order]);

	// Determine if cancel button should be shown
	const canCancel = useMemo(() => {
		if (!order) return false;
		const cancellableStatuses = [
			OrderStatus.PENDING,
			OrderStatus.VERIFIED,
			OrderStatus.CONFIRMED,
			OrderStatus.PREPARING,
			OrderStatus.OUT_FOR_DELIVERY,
			OrderStatus.DELIVERED,
			OrderStatus.CANCELLED,
		];
		if (order.orderStatus === OrderStatus.DELIVERED) return false;
		if (order.orderStatus === OrderStatus.CANCELLED) return false;
		return cancellableStatuses.includes(order.orderStatus);
	}, [order]);

	// Determine if update status button should be shown
	const canUpdateStatus = useMemo(() => {
		if (!order) return false;
		return availableStatusOptions.length > 0;
	}, [order, availableStatusOptions]);

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '80vh',
				}}
			>
				<Spin size="large" tip="Loading order details..." />
			</div>
		);
	}

	if (error === 'Order not found') {
		return <OrderNotFound />;
	}

	if (error) {
		return (
			<div style={{ padding: '24px' }}>
				<Alert
					message="Error"
					description={error}
					type="error"
					showIcon
				/>
			</div>
		);
	}

	if (!order) {
		// This case should ideally be covered by error === 'Order not found' or general error
		// but as a fallback, if no error but no order, show not found.
		return <OrderNotFound />;
	}

	return (
		<div style={{ padding: '24px' }}>
			<Title level={2} style={{ marginBottom: '24px' }}>
				Order Details
			</Title>

			{/* {(userRole === Roles.ADMIN || userRole === Roles.MANAGER) && ( */}
			<div style={{ marginBottom: '24px' }}>
				<Space>
					{canUpdateStatus && (
						<Button
							type="primary"
							onClick={handleUpdateStatusClick}
						>
							Update Status
						</Button>
					)}
					{canCancel && (
						<Button danger onClick={handleCancelOrderClick}>
							Cancel Order
						</Button>
					)}
					{/* Add other admin/manager specific buttons here */}
				</Space>
			</div>
			{/* )} */}

			{/* Update Status Modal */}
			<Modal
				title="Update Order Status"
				open={isUpdateStatusModalVisible}
				onOk={confirmUpdateStatus}
				onCancel={() => setIsUpdateStatusModalVisible(false)}
				confirmLoading={isUpdatingStatus}
			>
				<p>Select the new status for Order #{order?.id.slice(-8)}:</p>
				<Select
					value={selectedNewStatus}
					onChange={(value: Order['orderStatus']) =>
						setSelectedNewStatus(value)
					}
					style={{ width: '100%' }}
				>
					{availableStatusOptions.map((status) => (
						<Option key={status} value={status}>
							{status.replace(/-/g, ' ').toUpperCase()}
						</Option>
					))}
				</Select>
			</Modal>

			{/* Cancel Order Confirmation Modal */}
			<Modal
				title="Confirm Order Cancellation"
				open={isCancelModalVisible}
				onOk={confirmCancelOrder}
				onCancel={() => setIsCancelModalVisible(false)}
				confirmLoading={isCancellingOrder}
				okText="Yes, Cancel"
				okButtonProps={{ danger: true }}
			>
				<p>
					Are you sure you want to cancel Order #{order?.id.slice(-8)}
					?
				</p>
				<p>This action cannot be undone.</p>
			</Modal>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={16}>
					<Space
						direction="vertical"
						size="large"
						style={{ width: '100%' }}
					>
						<OrderStatusOverviewCard
							orderId={order.id}
							orderStatus={order.orderStatus}
							paymentStatus={order.paymentStatus}
							paymentMode={order.paymentMode}
							createdAt={order.createdAt}
						/>
						<OrderItemsListCard items={order.items} />
					</Space>
				</Col>
				<Col xs={24} lg={8}>
					<Space
						direction="vertical"
						size="large"
						style={{ width: '100%' }}
					>
						<OrderDeliveryDetailsCard
							address={order.address}
							phone={order.phone}
							tenantId={order.tenantId}
						/>
						<OrderSummaryTotalsCard
							amounts={order.amounts}
							couponCode={order.couponCode}
						/>
					</Space>
				</Col>
			</Row>
		</div>
	);
};

export default OrderDetailPage;
