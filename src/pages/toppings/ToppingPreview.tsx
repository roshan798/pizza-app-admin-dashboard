import { Card, Spin, Typography, Avatar, Space, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import PreviewHeader from '../../components/PreviewHeader';
import { useQuery } from '@tanstack/react-query';
import { fetchToppingById } from '../../http/Catalog/toppings';

const { Text } = Typography;

export default function ToppingPreview() {
	const { id } = useParams();
	// navigation handled by PreviewHeader
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
		<>
			<PreviewHeader
				title={data.name}
				editPath="/toppings/edit"
				id={id}
			/>
			<Card bodyStyle={{ padding: 16 }}>
				<Row gutter={24} align="middle">
					<Col xs={24} sm={6} md={4}>
						<Avatar src={data.image} size={120} shape="square" />
					</Col>
					<Col xs={24} sm={18} md={20}>
						<Space direction="vertical">
							<div>
								<Text strong>Price: </Text>
								<Text>${data.price}</Text>
							</div>
							<div>
								<Text type="secondary">
									Tenant: {data.tenantId}
								</Text>
							</div>
						</Space>
					</Col>
				</Row>
			</Card>
		</>
	);
}
