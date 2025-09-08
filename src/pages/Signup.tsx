import { Form, Input, Button, Select, Typography } from 'antd';
import {
	UserOutlined,
	MailOutlined,
	LockOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../http/auth';
import type { ApiError, Roles } from '../types';
import type { SignupPayload } from '../types/Payloads';
import { useNotification } from '../hooks/useNotification';
import { useMutation } from '@tanstack/react-query';
import { mapServerFormErrors } from '../utils';

const { Title } = Typography;
const { Option } = Select;

const RolesOptions = [
	{ value: 'admin', label: 'Admin' },
	{ value: 'manager', label: 'Manager' },
	{ value: 'customer', label: 'Customer' },
];

const Signup = () => {
	const [form] = Form.useForm<SignupPayload>();
	const navigate = useNavigate();
	const notify = useNotification();

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: SignupPayload) => signup(payload),
		onSuccess: () => {
			notify('success', 'Account created successfully. Please login.');
			navigate('/login');
		},
		onError: (error: unknown) => {
			const apiError = error as ApiError;
			const fieldErrors = mapServerFormErrors(
				apiError.response?.data?.errors
			);

			if (fieldErrors.general) {
				notify('error', fieldErrors.general);
			} else {
				Object.entries(fieldErrors).forEach(([field, msg]) => {
					form.setFields([
						{
							name: field as keyof SignupPayload,
							errors: [msg],
						},
					]);
				});
			}
		},
	});

	const handleSignup = (values: SignupPayload) => {
		mutate({ ...values, role: values.role as Roles });
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				background: '#f5f5f5',
			}}
		>
			<Form
				form={form}
				onFinish={handleSignup}
				layout="vertical"
				style={{
					background: '#fff',
					padding: 32,
					borderRadius: 8,
					boxShadow: '0 2px 8px #f0f1f2',
					width: 350,
				}}
				initialValues={{ role: 'customer' }}
			>
				<Title
					level={3}
					style={{ textAlign: 'center', marginBottom: 24 }}
				>
					Sign Up
				</Title>

				<Form.Item
					name="firstName"
					rules={[
						{ required: true, message: 'First name is required' },
					]}
				>
					<Input
						placeholder="Enter your first name"
						prefix={<UserOutlined style={{ color: '#f65f42' }} />}
					/>
				</Form.Item>

				<Form.Item
					name="lastName"
					rules={[
						{ required: true, message: 'Last name is required' },
					]}
				>
					<Input
						placeholder="Enter your last name"
						prefix={<UserOutlined style={{ color: '#f65f42' }} />}
					/>
				</Form.Item>

				<Form.Item
					name="email"
					rules={[
						{ required: true, message: 'Please input your email!' },
						{ type: 'email', message: 'Invalid email!' },
					]}
				>
					<Input
						type="email"
						placeholder="Enter your email"
						prefix={<MailOutlined style={{ color: '#f65f42' }} />}
					/>
				</Form.Item>

				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
						{
							min: 6,
							message: 'Password must be at least 6 characters',
						},
					]}
				>
					<Input.Password
						placeholder="Enter your password"
						prefix={<LockOutlined style={{ color: '#f65f42' }} />}
					/>
				</Form.Item>

				<Form.Item
					name="role"
					rules={[{ required: true, message: 'Role is required' }]}
				>
					<Select
						suffixIcon={
							<TeamOutlined style={{ color: '#f65f42' }} />
						}
					>
						{RolesOptions.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						block
						icon={<UserOutlined />}
						loading={isPending} // <-- React Query handles loading state
						style={{
							background: '#f65f42',
							borderColor: '#f65f42',
						}}
					>
						Create Account
					</Button>
				</Form.Item>

				<div style={{ textAlign: 'center' }}>
					Already have an account? <Link to="/login">Login</Link>
				</div>
			</Form>
		</div>
	);
};

export default Signup;
