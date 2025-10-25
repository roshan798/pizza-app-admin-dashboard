import { Card, Spin, Typography, Avatar, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchToppingById } from '../../http/Catalog/toppings';

const { Title, Text } = Typography;

export default function ToppingPreview() {
	const { id } = useParams();
	const { data, isLoading } = useQuery({
		queryKey: ['toppings', id],
		queryFn: async () => {
			const res = await fetchToppingById(String(id));
			return res.data.data;
		},
		enabled: !!id,
	});

	if (isLoading)
		return (
			<div style={{ padding: 24, textAlign: 'center' }}>
				<Spin />
			</div>
		);

	if (!data) return <div style={{ padding: 24 }}>Topping not found</div>;

	return (
		<Card>
			<Space direction="horizontal" align="center">
				<Avatar src={data.image} size={120} shape="square" />
				<div>
					<Title level={3}>{data.name}</Title>
					<Text strong>Price: </Text>
					<Text>${data.price}</Text>
					<br />
					<Text type="secondary">Tenant: {data.tenantId}</Text>
				</div>
			</Space>
		</Card>
	);
}
