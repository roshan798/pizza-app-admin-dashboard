import {
	Form,
	Input,
	Button,
	Select,
	Typography,
	Card,
	Row,
	Col,
	Space,
} from 'antd';
import {
	UserOutlined,
	MailOutlined,
	LockOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../http/auth';
import type { Roles, ApiError } from '../types';
import { useMutation } from '@tanstack/react-query';
import { useNotification } from '../hooks/useNotification';
import { mapServerFormErrors } from '../utils';
import type { SignupPayload } from '../types/Payloads';

const { Title, Text } = Typography;
const { Option } = Select;

const RolesOptions = [
	{ value: 'admin', label: 'Admin' },
	{ value: 'manager', label: 'Manager' },
	{ value: 'customer', label: 'Customer' },
];

export const Signup = () => {
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

	const handleSignup = (values: SignupPayload) => {
		mutate({ ...values, role: values.role as Roles });
	};

	return (
		<Row
			justify="center"
			align="middle"
			style={{ minHeight: '100vh', background: '#f5f5f5' }}
		>
			<Col xs={22} sm={16} md={12} lg={8}>
				<Card bordered style={{ borderRadius: 8, padding: 32 }}>
					<Space
						direction="vertical"
						size="large"
						style={{ width: '100%' }}
					>
						<Title level={3} style={{ textAlign: 'center' }}>
							Sign Up
						</Title>

						<Form
							form={form}
							onFinish={handleSignup}
							layout="vertical"
							initialValues={{ role: 'customer' }}
						>
							<Form.Item
								name="firstName"
								rules={[
									{
										required: true,
										message: 'First name is required',
									},
								]}
							>
								<Input
									placeholder="First name"
									prefix={
										<UserOutlined
											style={{ color: '#f65f42' }}
										/>
									}
								/>
							</Form.Item>

							<Form.Item
								name="lastName"
								rules={[
									{
										required: true,
										message: 'Last name is required',
									},
								]}
							>
								<Input
									placeholder="Last name"
									prefix={
										<UserOutlined
											style={{ color: '#f65f42' }}
										/>
									}
								/>
							</Form.Item>

							<Form.Item
								name="email"
								rules={[
									{
										required: true,
										message: 'Email is required',
									},
									{ type: 'email', message: 'Invalid email' },
								]}
							>
								<Input
									placeholder="Email"
									prefix={
										<MailOutlined
											style={{ color: '#f65f42' }}
										/>
									}
								/>
							</Form.Item>

							<Form.Item
								name="password"
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
									placeholder="Password"
									prefix={
										<LockOutlined
											style={{ color: '#f65f42' }}
										/>
									}
								/>
							</Form.Item>

							<Form.Item
								name="role"
								rules={[
									{
										required: true,
										message: 'Role is required',
									},
								]}
							>
								<Select
									suffixIcon={
										<TeamOutlined
											style={{ color: '#f65f42' }}
										/>
									}
								>
									{RolesOptions.map((option) => (
										<Option
											key={option.value}
											value={option.value}
										>
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
									loading={isPending}
									style={{
										background: '#f65f42',
										borderColor: '#f65f42',
									}}
								>
									Create Account
								</Button>
							</Form.Item>
						</Form>

						<Text style={{ textAlign: 'center', display: 'block' }}>
							Already have an account?{' '}
							<Link to="/login">Login</Link>
						</Text>
					</Space>
				</Card>
			</Col>
		</Row>
	);
};

export default Signup;
