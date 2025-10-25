import React from 'react';
import { Card, Form, Input, Button, Upload, Spin } from 'antd';
import type { UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
	createTopping,
	fetchToppingById,
	updateTopping,
} from '../../../http/Catalog/toppings';
import { TenantSection } from '../../Products/ProductsForm/sections/TenantSection';
import { useUserStore } from '../../../store/userStore';

interface FormValues {
	name: string;
	price: number;
	tenantId?: string;
	image?: UploadFile[];
}

export default function ToppingFormPage() {
	const [form] = Form.useForm<FormValues>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { id } = useParams();
	const isEdit = Boolean(id);
	const { user } = useUserStore();

	const { data: detail, isLoading: loadingDetail } = useQuery({
		queryKey: ['toppings', id],
		enabled: isEdit,
		queryFn: async () => {
			const res = await fetchToppingById(String(id));
			return res.data.data;
		},
	});

	const mutation = useMutation({
		mutationFn: async (fd: FormData) =>
			isEdit ? updateTopping(String(id), fd) : createTopping(fd),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['toppings'] });
			navigate('/toppings');
		},
	});

	React.useEffect(() => {
		if (detail) {
			form.setFieldsValue({
				name: detail.name,
				price: detail.price,
				tenantId: detail.tenantId,
			});
		}
	}, [detail, form]);

	if (loadingDetail)
		return (
			<div style={{ padding: 24, textAlign: 'center' }}>
				<Spin />
			</div>
		);

	const handleSubmit = (values: FormValues) => {
		const fd = new FormData();
		fd.append(
			'data',
			JSON.stringify({
				name: values.name,
				price: Number(values.price),
				tenantId: values.tenantId,
			})
		);
		if (values.image && values.image.length > 0) {
			const f = values.image[0];
			if (f.originFileObj)
				fd.append('image', f.originFileObj as File, f.name);
		}
		mutation.mutate(fd);
	};

	return (
		<Card>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{ price: 0 }}
			>
				<Form.Item
					label="Name"
					name="name"
					rules={[{ required: true, message: 'Enter topping name' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Price"
					name="price"
					rules={[{ required: true, message: 'Enter price' }]}
				>
					<Input type="number" />
				</Form.Item>

				{user && user.role === 'admin' && (
					<TenantSection
						setSelectedTenantId={() => {}}
						selectedTenantId={undefined}
					/>
				)}

				<Form.Item
					label="Image"
					name="image"
					valuePropName="fileList"
					getValueFromEvent={(e) =>
						e && e.fileList ? e.fileList : []
					}
				>
					<Upload
						listType="picture"
						beforeUpload={() => false}
						maxCount={1}
					>
						<Button icon={<UploadOutlined />}>Upload</Button>
					</Upload>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={mutation.isPending}
					>
						{isEdit ? 'Update Topping' : 'Create Topping'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
