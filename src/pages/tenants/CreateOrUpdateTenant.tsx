import { useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenants } from './hooks/useTenants';
import type { Tenant } from './types/types';
import { useNotification } from '../../hooks/useNotification';

export default function CreateOrUpdateTenant() {
	const { id } = useParams();
	const navigate = useNavigate();
	const notify = useNotification();
	const { create, update, tenants, isLoading } = useTenants();

	const editingTenant: Tenant | undefined = tenants.find(
		(t: Tenant) => t.id === Number(id)
	);

	useEffect(() => {
		if (id && !editingTenant && !isLoading) {
			notify('error', 'Tenant not found!');

			navigate('/tenants', { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, editingTenant, isLoading]);

	const onFinish = (values: Tenant) => {
		if (id) {
			update.mutate(
				{ id: Number(id), data: values },
				{ onSuccess: () => message.success('Tenant updated 🎉') }
			);
		} else {
			create.mutate(values, {
				onSuccess: () => message.success('Tenant created 🎉'),
			});
		}
		navigate('/tenants');
	};

	if (isLoading)
		return (
			<Spin size="large" style={{ display: 'block', marginTop: 100 }} />
		);

	return (
		<Card
			title={id ? 'Edit Tenant' : 'Create Tenant'}
			style={{ margin: 24 }}
		>
			<Form
				layout="vertical"
				onFinish={onFinish}
				initialValues={editingTenant}
			>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12}>
						<Form.Item
							name="name"
							label="Name"
							rules={[
								{ required: true, message: 'Name is required' },
							]}
						>
							<Input placeholder="Enter tenant name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							name="address"
							label="Address"
							rules={[
								{
									required: true,
									message: 'Address is required',
								},
							]}
						>
							<Input placeholder="Enter tenant address" />
						</Form.Item>
					</Col>
				</Row>

				<Row justify="end">
					<Col>
						<Button type="primary" htmlType="submit">
							{id ? 'Update' : 'Create'}
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
