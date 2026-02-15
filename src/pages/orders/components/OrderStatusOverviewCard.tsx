import React from 'react';
import { Card, Typography, Flex, Tag, Space } from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EnvironmentOutlined,
    InboxOutlined,
    DollarCircleOutlined,
    CreditCardOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { OrderStatus, PaymentStatus, type Order } from '../../../http/Orders/order-types';
import { toDateTime } from '../../../utils';

const { Title, Text } = Typography;

interface OrderStatusOverviewCardProps {
    orderId: string;
    orderStatus: Order['orderStatus'];
    paymentStatus: Order['paymentStatus'];
    paymentMode: Order['paymentMode'];
    createdAt: string;
}

type StatusConfig = {
    icon: React.ReactNode;
    color: string;
    text: string;
};

const getStatusConfig = (status: Order['orderStatus']): StatusConfig => {
    const configMap: Record<Order['orderStatus'], StatusConfig> = {
        [OrderStatus.PENDING]: { icon: <ClockCircleOutlined />, color: 'default', text: 'Pending' },
        [OrderStatus.VERIFIED]: { icon: <CheckCircleOutlined />, color: 'processing', text: 'Verified' },
        [OrderStatus.CONFIRMED]: { icon: <CheckCircleOutlined />, color: 'processing', text: 'Confirmed' },
        [OrderStatus.PREPARING]: { icon: <InboxOutlined />, color: 'warning', text: 'Preparing' },
        [OrderStatus.OUT_FOR_DELIVERY]: { icon: <EnvironmentOutlined />, color: 'warning', text: 'Out for Delivery' },
        [OrderStatus.DELIVERED]: { icon: <CheckCircleOutlined />, color: 'success', text: 'Delivered' },
        [OrderStatus.CANCELLED]: { icon: <CloseCircleOutlined />, color: 'error', text: 'Cancelled' },
    };
    return configMap[status] || configMap[OrderStatus.PENDING];
};

const getPaymentStatusConfig = (status: Order['paymentStatus']): StatusConfig => {
    const configMap: Record<Order['paymentStatus'], StatusConfig> = {
        [PaymentStatus.PAID]: { icon: <DollarCircleOutlined />, color: 'success', text: 'Paid' },
        [PaymentStatus.UNPAID]: { icon: <DollarCircleOutlined />, color: 'error', text: 'Unpaid' },
        [PaymentStatus.PENDING]: { icon: <DollarCircleOutlined />, color: 'warning', text: 'Pending' },
        [PaymentStatus.NO_PAYMENT_REQUIRED]: { icon: <DollarCircleOutlined />, color: 'default', text: 'No Payment' },
    };
    return configMap[status] || configMap[PaymentStatus.PENDING];
};

const OrderStatusOverviewCard: React.FC<OrderStatusOverviewCardProps> = ({ orderId, orderStatus, paymentStatus, paymentMode, createdAt }) => {
    const statusConfig = getStatusConfig(orderStatus);
    const paymentConfig = getPaymentStatusConfig(paymentStatus);

    return (
        <Card>
            <Flex justify="space-between" align="flex-start" style={{ marginBottom: '16px' }}>
                <Space direction="vertical" size={4}>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>Order Number</Text>
                    <Title level={3} style={{ margin: 0 }}>#{orderId.slice(-8)}</Title>
                </Space>
                <Tag icon={statusConfig.icon} color={statusConfig.color} style={{ padding: '6px 12px', fontSize: 14 }}>
                    {statusConfig.text}
                </Tag>
            </Flex>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Flex align="center" gap="small">
                    <CalendarOutlined style={{ color: '#1890ff' }} /> <Text strong>Order Date:</Text> <Text>{toDateTime(createdAt)}</Text>
                </Flex>
                <Flex align="center" gap="small">
                    <CreditCardOutlined style={{ color: '#52c41a' }} /> <Text strong>Payment:</Text> <Tag color={paymentConfig.color}>{paymentConfig.text}</Tag> <Text type="secondary">({paymentMode})</Text>
                </Flex>
            </Space>
        </Card>
    );
};

export default OrderStatusOverviewCard;