// OrdersTable.tsx
import React from 'react';
import {
	Table,
	Button,
	Space,
	Flex,
	Tag,
	Badge,
	Empty,
	Typography,
	Card,
} from 'antd';
import {
	EnvironmentOutlined,
	PhoneOutlined,
	ClockCircleOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	RightOutlined,
	InboxOutlined,
} from '@ant-design/icons';
import type { Order } from '../../../http/Orders/order-types';
import { toDateTime } from '../../../utils';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;
interface OrdersTableProps {
	orders: Order[];
	loading: boolean;
	total: number;
	page: number;
	limit: number;
	onPagination: (page: number, limit: number) => void;
	onPageSize: (limit: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
	orders,
	loading,
	total,
	page,
	limit,
	onPagination,
	onPageSize,
}) => {
	const navigate = useNavigate();

	type StatusConfig = {
		color: 'default' | 'processing' | 'warning' | 'success' | 'error';
		icon: React.ReactNode;
		text: string;
	};

	const getStatusConfig = (status: Order['orderStatus']): StatusConfig => {
		const configMap: Record<Order['orderStatus'], StatusConfig> = {
			pending: {
				color: 'default',
				icon: <ClockCircleOutlined />,
				text: 'Pending',
			},
			verified: {
				color: 'processing',
				icon: <CheckCircleOutlined />,
				text: 'Verified',
			},
			confirmed: {
				color: 'processing',
				icon: <CheckCircleOutlined />,
				text: 'Confirmed',
			},
			preparing: {
				color: 'warning',
				icon: <InboxOutlined />,
				text: 'Preparing',
			},
			'out-for-delivery': {
				color: 'warning',
				icon: <EnvironmentOutlined />,
				text: 'Out for Delivery',
			},
			delivered: {
				color: 'success',
				icon: <CheckCircleOutlined />,
				text: 'Delivered',
			},
			cancelled: {
				color: 'error',
				icon: <CloseCircleOutlined />,
				text: 'Cancelled',
			}, // Ensure 'error' is a valid Badge status
		};
		return configMap[status] || configMap['pending'];
	};

	// Define a type for payment configuration
	type PaymentConfig = {
		color:
			| 'green'
			| 'volcano'
			| 'geekblue'
			| 'orange'
			| 'default'
			| 'success'
			| 'error'
			| 'warning'; // Tag colors are more flexible
		text: string;
	};

	const getPaymentConfig = (
		status: Order['paymentStatus']
	): PaymentConfig => {
		const configMap: Record<Order['paymentStatus'], PaymentConfig> = {
			PAID: { color: 'green', text: 'Paid' },
			UNPAID: { color: 'volcano', text: 'Unpaid' },
			NO_PAYMENT_REQUIRED: { color: 'geekblue', text: 'No Payment' },
			PENDING: { color: 'orange', text: 'Pending' },
		};
		return configMap[status] || { color: 'default', text: 'Unknown' }; // Default color for Tag
	};

	const handleViewOrder = (orderId: string) => {
		navigate(`/orders/${orderId}`);
	};

	const columns: ColumnsType<Order> = [
		{
			title: 'Order',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			// sorter: true,
			render: (id: string, record: Order) => (
				<Flex vertical gap={4}>
					<Text strong ellipsis style={{ width: 80 }}>
						# {id.slice(-8)}
					</Text>
					<Text type="secondary" style={{ fontSize: 12 }}>
						{toDateTime(record.createdAt)}
					</Text>
				</Flex>
			),
		},
		{
			title: 'Tenant',
			dataIndex: 'tenantId',
			key: 'tenantId',
			width: 50,
			// sorter: true,
			render: (id: string) => (
				<Flex vertical gap={4}>
					<Text strong ellipsis style={{ width: 80 }}>
						{id}
					</Text>
					{/* <Text type="secondary" style={{ fontSize: 12 }}>
						{toDateTime(record.createdAt)}
					</Text> */}
				</Flex>
			),
		},
		{
			title: 'Items',
			dataIndex: 'items',
			key: 'items',
			width: 120,
			sorter: (a: Order, b: Order) => a.items.length - b.items.length,
			render: (items: Order['items']) => (
				<Space direction="vertical" size="small">
					<Text strong>{items.length} items</Text>
					<Text type="secondary" style={{ fontSize: 12 }}>
						₹
						{items
							.reduce((sum, item) => sum + item.itemTotal, 0)
							.toFixed(2)}
					</Text>
				</Space>
			),
		},
		{
			title: 'Delivery',
			key: 'delivery',
			width: 200,
			render: (_: unknown, record: Order) => (
				<Space direction="vertical" size="small">
					<Flex gap={4} align="center">
						<EnvironmentOutlined
							style={{ color: '#1890ff', fontSize: 16 }}
						/>
						<Text
							ellipsis
							style={{ maxWidth: 120 }}
							title={record.address}
						>
							{record.address.split(',')[0]}
						</Text>
					</Flex>
					<Flex gap={4} align="center">
						<PhoneOutlined
							style={{ color: '#52c41a', fontSize: 14 }}
						/>
						<Text style={{ fontSize: 12 }}>{record.phone}</Text>
					</Flex>
				</Space>
			),
		},
		{
			title: 'Payment',
			key: 'payment',
			width: 120,
			render: (_: unknown, record: Order) => {
				const paymentConfig = getPaymentConfig(record.paymentStatus);
				return (
					<Space direction="vertical" size="small">
						<Tag color={paymentConfig.color}>
							{paymentConfig.text}
						</Tag>
						<Text type="secondary" style={{ fontSize: 12 }}>
							{record.paymentMode}
						</Text>
					</Space>
				);
			},
		},
		{
			title: 'Amount',
			key: 'amount',
			width: 120,
			sorter: (a: Order, b: Order) =>
				a.amounts.grandTotal - b.amounts.grandTotal,
			render: (_: unknown, record: Order) => (
				<Flex vertical align="start" gap={4}>
					<Text strong>₹{record.amounts.grandTotal.toFixed(2)}</Text>
					{record.couponCode && (
						<Tag color="purple" style={{ fontSize: 11 }}>
							COUPON
						</Tag>
					)}
				</Flex>
			),
		},
		{
			title: 'Status',
			key: 'status',
			width: 140,
			// sorter: true,
			render: (_: unknown, record: Order) => {
				const statusConfig = getStatusConfig(record.orderStatus);
				return (
					<Flex gap={8} align="center">
						{statusConfig.icon}
						<Badge
							status={statusConfig.color}
							text={statusConfig.text}
						/>
					</Flex>
				);
			},
		},
		{
			title: 'Action',
			key: 'action',
			width: 100,
			fixed: 'right',
			render: (_: unknown, record: Order) => (
				<Button
					type="link"
					size="small"
					onClick={() => handleViewOrder(record.id)}
					icon={<RightOutlined />}
				>
					View
				</Button>
			),
		},
	];

	return (
		<Card>
			{orders.length === 0 ? (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={
						<Space direction="vertical" size="small">
							<Text>No orders found</Text>
							<Button
								type="primary"
								onClick={() => navigate('/products')}
							>
								Start Shopping
							</Button>
						</Space>
					}
				/>
			) : (
				<Table
					columns={columns}
					dataSource={orders}
					rowKey="id"
					loading={loading}
					pagination={{
						current: page,
						pageSize: limit,
						total,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} of ${total} orders`,
						onChange: onPagination,
						onShowSizeChange: onPageSize,
					}}
					scroll={{ x: 1000 }}
					size="middle"
					rowClassName="hover:cursor-pointer"
					onRow={(record) => ({
						onClick: () => handleViewOrder(record.id),
					})}
				/>
			)}
		</Card>
	);
};

export default OrdersTable;
