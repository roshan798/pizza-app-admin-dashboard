import React from 'react';
import { Empty, Button, Typography, Flex } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const OrderNotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Flex justify="center" align="center" style={{ minHeight: '80vh', padding: '24px' }}>
            <Empty
                image={<ShoppingOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
                description={
                    <Flex vertical align="center" gap="small">
                        <Title level={3} style={{ margin: 0 }}>Order Not Found</Title>
                        <Text type="secondary">
                            We couldn't find this order or you don't have permission to view it.
                        </Text>
                        <Button type="primary" onClick={() => navigate('/orders')} style={{ marginTop: '16px' }}>
                            Back to Orders List
                        </Button>
                    </Flex>
                }
            />
        </Flex>
    );
};

export default OrderNotFound;