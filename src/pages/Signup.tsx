import { Form, Input, Button, Select, Typography } from 'antd';
import {
	UserOutlined,
	MailOutlined,
	LockOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../http/auth';
import type { Roles } from '../types';
import type { SignupPayload } from '../types/Payloads';
import { useNotification } from '../hooks/useNotification';

const { Title } = Typography;
const { Option } = Select;

const RolesOptions = [
	{ value: 'admin', label: 'Admin' },
	{ value: 'manager', label: 'Manager' },
	{ value: 'customer', label: 'Customer' },
];

const Signup = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const notify = useNotification();
	const handleSignup = async (values: SignupPayload) => {
		try {
			const signupPayload = { ...values, role: values.role as Roles };
			await signup(signupPayload);
			notify('success', 'Account created succesfully, Please login.');
			navigate('/login');
		} catch (err) {
			const error = err as unknown as Error;
			notify('error', error.message || 'Something bad happenned');
		}
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
					// label="First Name"
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
					// label="Last Name"
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
					// label="Email"
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
					// label="Password"
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
					// label="Role"
					name="role"
					rules={[{ required: true, message: 'Role is required' }]}
				>
					<Select
						suffixIcon={
							<TeamOutlined style={{ color: '#f65f42' }} />
						}
						style={{ color: '#f65f42' }}
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
