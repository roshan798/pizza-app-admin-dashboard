import {
	Form,
	Input,
	Button,
	Select,
	Card,
	Typography,
	Row,
	Col,
	Switch,
	Space,
	Spin,
} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SignupPayload } from '../../types/Payloads';
import { useNotification } from '../../hooks/useNotification';
import type { ApiError } from '../../types';
import { mapServerFormErrors } from '../../utils';
import {
	createUser,
	getUserById,
	updateUserById,
	type UpdateUserPayload,
} from '../../http/users';
import { getAllTenants } from '../../http/tenants';
import type { User } from '../../store/userStore';

export interface Tenant {
	id: string;
	name: string;
	address: string;
	created_at: Date;
	updated_at: Date;
}

const { Title } = Typography;
const { Option } = Select;

const fetchUserById = async (userId: string) => {
	const res = await getUserById(userId);
	return res.data.user as User;
};

const CreateOrUpdateUser = () => {
	const [form] = Form.useForm<SignupPayload>();
	const navigate = useNavigate();
	const notify = useNotification();
	const { userId } = useParams();

	const isEdit = Boolean(userId);

	// Fetch tenants
	const { data: tenantsData, isLoading: tenantsLoading } = useQuery({
		queryKey: ['tenants'],
		queryFn: async () => {
			const { data } = await getAllTenants();
			return data.tenants;
		},
	});

	// Fetch user if in edit mode
	const { data: userData, isLoading: userLoading } = useQuery<User>({
		queryKey: ['user', userId],
		queryFn: () => fetchUserById(userId!),
		enabled: isEdit,
	});

	// Prefill form when user data is available
	useEffect(() => {
		if (userData) {
			form.setFieldsValue(userData);
		}
	}, [userData, form]);

	// Mutations
	const { mutate, isPending } = useMutation({
		mutationFn: async (payload: SignupPayload) => {
			if (isEdit) {
				const upadatePayload = payload as unknown as UpdateUserPayload;
				return updateUserById(userId!, upadatePayload);
			}
			return createUser(payload);
		},
		onSuccess: () => {
			notify('success', isEdit ? 'User updated 🎉' : 'User created 🎉');
			navigate('/users');
		},
		onError: (error: unknown) => {
			const apiError = error as ApiError;
			const fieldErrors = mapServerFormErrors(apiError.response?.data);

			if (fieldErrors.general) {
				notify('error', fieldErrors.general);
			} else {
				Object.entries(fieldErrors).forEach(([field, msg]) => {
					form.setFields([
						{ name: field as keyof SignupPayload, errors: [msg] },
					]);
				});
			}
		},
	});

	const handleSubmit = (values: SignupPayload) => {
		mutate(values);
	};

	if (isEdit && userLoading) {
		return <Spin fullscreen />;
	}

	return (
		<div style={{ padding: 24 }}>
			{/* Header */}
			<Row
				justify="space-between"
				align="middle"
				style={{ marginBottom: 24 }}
			>
				<Title level={4} style={{ margin: 0 }}>
					{isEdit ? 'Edit User' : 'Create User'}
				</Title>
				<Space>
					<Button onClick={() => navigate('/users')}>Cancel</Button>
					<Button
						type="primary"
						htmlType="submit"
						form="user-form"
						loading={isPending}
						style={{ backgroundColor: 'var(--color-primary)' }}
					>
						Save
					</Button>
				</Space>
			</Row>

			<Form
				id="user-form"
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
			>
				<Row gutter={24}>
					{/* Left Column */}
					<Col span={16}>
						<Card title="Basic info" style={{ marginBottom: 16 }}>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										name="firstName"
										label="First Name"
										rules={[
											{
												required: true,
												message:
													'First name is required',
											},
										]}
									>
										<Input
											prefix={<UserOutlined />}
											placeholder="Enter first name"
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="lastName"
										label="Last Name"
										rules={[
											{
												required: true,
												message:
													'Last name is required',
											},
										]}
									>
										<Input
											prefix={<UserOutlined />}
											placeholder="Enter last name"
										/>
									</Form.Item>
								</Col>
							</Row>

							<Form.Item
								name="email"
								label="Email"
								rules={[
									{
										required: true,
										message: 'Email is required',
									},
									{ type: 'email', message: 'Invalid email' },
								]}
							>
								<Input
									prefix={<MailOutlined />}
									placeholder="Enter email"
								/>
							</Form.Item>
						</Card>

						{!isEdit && ( // password only for create
							<Card title="Security info">
								<Form.Item
									name="password"
									label="Password"
									rules={[
										{
											required: true,
											message: 'Password is required',
										},
										{
											min: 6,
											message:
												'Password must be at least 6 characters',
										},
									]}
								>
									<Input.Password
										prefix={<LockOutlined />}
										placeholder="Enter password"
									/>
								</Form.Item>
							</Card>
						)}
					</Col>

					{/* Right Column */}
					<Col span={8}>
						<Card
							title="Tenant (Optional)"
							style={{ marginBottom: 16 }}
						>
							<Form.Item name="tenantId" label="Select Tenant">
								<Select
									placeholder="Select tenant"
									loading={tenantsLoading}
									showSearch
									allowClear
									filterOption={(input, option) =>
										(option?.children as unknown as string)
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								>
									{tenantsData?.map((tenant: Tenant) => (
										<Option
											key={tenant.id}
											value={tenant.id}
										>
											{tenant.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Card>

						<Card title="Other properties">
							<Form.Item
								name="isActive"
								label="Active"
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Card>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default CreateOrUpdateUser;
