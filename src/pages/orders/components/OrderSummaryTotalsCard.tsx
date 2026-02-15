import React from 'react';
import { Card, Typography, Flex, Divider, Tag, Space } from 'antd';
import { DollarCircleOutlined, TagOutlined } from '@ant-design/icons';
import type { Order } from '../../../http/Orders/order-types';

const { Title, Text } = Typography;

interface OrderSummaryTotalsCardProps {
	amounts: Order['amounts'];
	couponCode?: string;
}

const OrderSummaryTotalsCard: React.FC<OrderSummaryTotalsCardProps> = ({
	amounts,
	couponCode,
}) => {
	return (
		<Card
			title={
				<Flex align="center" gap="small">
					<DollarCircleOutlined
						style={{ fontSize: '20px', color: '#52c41a' }}
					/>
					<Title level={4} style={{ margin: 0 }}>
						Order Summary
					</Title>
				</Flex>
			}
		>
			<Space direction="vertical" style={{ width: '100%' }} size="small">
				<Flex justify="space-between">
					<Text>Subtotal</Text>
					<Text strong>₹{amounts.subTotal.toFixed(2)}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Tax</Text>
					<Text strong>₹{amounts.tax.toFixed(2)}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Delivery Charge</Text>
					<Text strong>₹{amounts.deliveryCharge.toFixed(2)}</Text>
				</Flex>
				{amounts.discount > 0 && (
					<Flex justify="space-between">
						<Flex align="center" gap="small">
							<TagOutlined />
							<Text type="success">Discount</Text>
						</Flex>
						<Text strong type="success">
							- ₹{amounts.discount.toFixed(2)}
						</Text>
					</Flex>
				)}
				<Divider style={{ margin: '12px 0' }} />
				<Flex justify="space-between" align="center">
					<Title level={4} style={{ margin: 0 }}>
						Total Amount
					</Title>
					<Title level={4} style={{ margin: 0 }}>
						₹{amounts.grandTotal.toFixed(2)}
					</Title>
				</Flex>
				{couponCode && (
					<Flex justify="flex-end" style={{ marginTop: '8px' }}>
						<Tag color="purple">Coupon: {couponCode}</Tag>
					</Flex>
				)}
			</Space>
		</Card>
	);
};

export default OrderSummaryTotalsCard;
