import React from 'react';
import { Card, Typography, Flex, Space } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OrderDeliveryDetailsCardProps {
    address: string;
    phone: string;
    tenantId: string;
}

const OrderDeliveryDetailsCard: React.FC<OrderDeliveryDetailsCardProps> = ({ address, phone, tenantId }) => {
    return (
        <Card title={
            <Flex align="center" gap="small">
                <EnvironmentOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <Title level={4} style={{ margin: 0 }}>Delivery Details</Title>
            </Flex>
        }
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>Address</Text>
                    <Text style={{ display: 'block', marginTop: 4 }}>{address}</Text>
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>Phone</Text>
                    <Flex align="center" gap="small" style={{ marginTop: 4 }}>
                        <PhoneOutlined style={{ color: '#52c41a' }} />
                        <Text>{phone}</Text>
                    </Flex>
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>Tenant ID</Text>
                    <Flex align="center" gap="small" style={{ marginTop: 4 }}>
                        <BankOutlined style={{ color: '#faad14' }} />
                        <Text code>{tenantId}</Text>
                    </Flex>
                </div>
            </Space>
        </Card>
    );
};

export default OrderDeliveryDetailsCard;