// OrdersFilters.tsx
import React from 'react';
import { Input, Select, Row, Col, Card } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { SearchOutlined } from '@ant-design/icons';

interface OrdersFiltersProps {
	paymentStatus: string;
	orderStatus: string;
	searchQuery: string;
	onSearch: (query: string) => void;
	onPaymentFilter: (status: string) => void;
	onStatusFilter: (status: string) => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
	paymentStatus,
	orderStatus,
	searchQuery,
	onSearch,
	onPaymentFilter,
	onStatusFilter,
}) => {
	const paymentOptions: SelectProps['options'] = [
		{ value: '', label: 'All Payments' },
		{ value: 'PAID', label: 'Paid' },
		{ value: 'UNPAID', label: 'Unpaid' },
		{ value: 'PENDING', label: 'Pending' },
		{ value: 'NO_PAYMENT_REQUIRED', label: 'No Payment' },
	];

	const statusOptions: SelectProps['options'] = [
		{ value: '', label: 'All Status' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'preparing', label: 'Preparing' },
		{ value: 'out-for-delivery', label: 'Out for Delivery' },
		{ value: 'delivered', label: 'Delivered' },
		{ value: 'cancelled', label: 'Cancelled' },
	];

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(e.target.value);
	};

	return (
		<Card style={{ marginBottom: 24 }}>
			<Row gutter={16} align="middle">
				<Col xs={24} sm={12} md={8}>
					<Input
						placeholder="Search orders..."
						prefix={<SearchOutlined />}
						value={searchQuery}
						onChange={handleSearchChange}
						allowClear
						style={{ width: '100%' }}
					/>
				</Col>
				<Col xs={12} sm={6} md={4}>
					<Select
						placeholder="Payment Status"
						value={paymentStatus}
						onChange={onPaymentFilter}
						allowClear
						style={{ width: '100%' }}
						options={paymentOptions}
					/>
				</Col>
				<Col xs={12} sm={6} md={4}>
					<Select
						placeholder="Order Status"
						value={orderStatus}
						onChange={onStatusFilter}
						allowClear
						style={{ width: '100%' }}
						options={statusOptions}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default OrdersFilters;
