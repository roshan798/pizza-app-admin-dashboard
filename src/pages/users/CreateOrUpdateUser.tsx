import { useEffect } from 'react';
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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { SignupPayload } from '../../types/Payloads';
import { useNotification } from '../../hooks/useNotification';
import { mapServerFormErrors } from '../../utils';
import {
	createUser,
	getUserById,
	updateUserById,
	type UpdateUserPayload,
} from '../../http/users';
import { getAllTenants } from '../../http/tenants';
import type { User } from '../../store/userStore';
import type { ApiError } from '../../types';

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

	const isEditMode = Boolean(userId);

	const { data: tenantsData, isLoading: tenantsLoading } = useQuery({
		queryKey: ['tenants'],
		queryFn: async () => {
			const { data } = await getAllTenants();
			return data.tenants;
		},
	});

	const {
		data: userData,
		isLoading: userLoading,
		error: userError,
	} = useQuery<User>({
		queryKey: ['user', userId],
		queryFn: () => fetchUserById(userId!),
		enabled: isEditMode,
	});

	useEffect(() => {
		if (userData) form.setFieldsValue(userData);
	}, [userData, form]);

	useEffect(() => {
		if (userError) {
			notify('error', 'User not found!');
			navigate('/users', { replace: true });
		}
	}, [userError, notify, navigate]);

	const { mutate, isPending } = useMutation({
		mutationFn: async (payload: SignupPayload) => {
			if (isEditMode) {
				const updatePayload = payload as unknown as UpdateUserPayload;
				return updateUserById(userId!, updatePayload);
			}
			return createUser(payload);
		},
		onSuccess: () => {
			notify(
				'success',
				isEditMode ? 'User updated 🎉' : 'User created 🎉'
			);
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

	const handleSubmit = (values: SignupPayload) => mutate(values);

	if ((isEditMode && userLoading) || tenantsLoading)
		return <Spin size="large" style={{ width: '100%', marginTop: 100 }} />;

	return (
		<Card style={{ margin: 24 }}>
			<Row
				justify="space-between"
				align="middle"
				style={{ marginBottom: 24 }}
			>
				<Title level={4} style={{ margin: 0 }}>
					{isEditMode ? 'Edit User' : 'Create User'}
				</Title>
				<Space>
					<Button>
						<Link to={'/users'}>Cancel</Link>
					</Button>
					<Button
						type="primary"
						htmlType="submit"
						form="user-form"
						loading={isPending}
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
				<Row gutter={[24, 24]}>
					{/* Left Column */}
					<Col xs={24} lg={16}>
						<Card title="Basic Info" style={{ marginBottom: 16 }}>
							<Row gutter={16}>
								<Col xs={24} sm={12}>
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
								<Col xs={24} sm={12}>
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

						{!isEditMode && (
							<Card title="Security Info">
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
					<Col xs={24} lg={8}>
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

						<Card title="Other Properties">
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
		</Card>
	);
};

export default CreateOrUpdateUser;
