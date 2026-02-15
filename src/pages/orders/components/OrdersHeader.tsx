// OrdersHeader.tsx
import React from 'react';
import { Flex, Badge, Avatar, Card, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
interface OrdersHeaderProps {
	ordersCount?: number;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ ordersCount = 0 }) => {
	return (
		<Card style={{ marginBottom: 24 }}>
			<Flex justify="space-between" align="center">
				<div>
					<Title level={2} style={{ margin: 0, color: '#1f1f1f' }}>
						My Orders
					</Title>
					<Text type="secondary">
						Track and manage all your recent orders
					</Text>
				</div>
				<Badge count={ordersCount} style={{ background: '#1890ff' }}>
					<Avatar
						shape="square"
						size={32}
						icon={<ShoppingCartOutlined />}
					/>
				</Badge>
			</Flex>
		</Card>
	);
};

export default OrdersHeader;
