import React from 'react';
import { Card, Typography, Flex, Space, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { Order } from '../../../http/Orders/order-types';

const { Title, Text } = Typography;

interface OrderItemsListCardProps {
    items: Order['items'];
}

const OrderItemsListCard: React.FC<OrderItemsListCardProps> = ({ items }) => {
    return (
        <Card
            title={
                <Flex align="center" justify="space-between">
                    <Flex align="center" gap="small">
                        <ShoppingCartOutlined style={{ fontSize: '20px', color: '#9254de' }} />
                        <Title level={4} style={{ margin: 0 }}>Order Items</Title>
                    </Flex>
                    <Tag color="blue">{items.length} {items.length === 1 ? 'item' : 'items'}</Tag>
                </Flex>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {items.map((item, index) => (
                    <Flex key={index} justify="space-between" align="center" style={{ padding: '8px 0', borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                        <Space direction="vertical" size={2}>
                            <Text strong>{item.productName}</Text>
                            <Flex align="center" gap="small">
                                <Tag>{item.base.name}</Tag>
                                <Text type="secondary">x {item.quantity}</Text>
                            </Flex>
                            {item.toppings && item.toppings.length > 0 && (
                                <Flex wrap gap="small">
                                    {item.toppings.map((topping, tIndex) => (
                                        <Tag key={tIndex} color="geekblue" style={{ fontSize: 11 }}>
                                            {topping._id || topping.id} (+₹{topping.price.toFixed(2)})
                                        </Tag>
                                    ))}
                                </Flex>
                            )}
                        </Space>
                        <Text strong style={{ fontSize: '16px' }}>
                            ₹{item.itemTotal.toFixed(2)}
                        </Text>
                    </Flex>
                ))}
            </Space>
        </Card>
    );
};

export default OrderItemsListCard;