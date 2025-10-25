import { Form, Input, Button, Typography, Card, Row, Col, Space } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useNotification } from '../hooks/useNotification';
import { useMutation } from '@tanstack/react-query';
import { mapServerFormErrors } from '../utils';
import type { ApiError } from '../types';
import { login } from '../http/Auth/auth';

const { Title, Text } = Typography;

const Login = () => {
	const [form] = Form.useForm();
	const { setId } = useUserStore();
	const notify = useNotification();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: login,
		onSuccess: (response) => {
			setId(response.data.id);
			notify('success', 'Login successful');
			navigate('/');
		},
		onError: (error: unknown) => {
			const apiError = error as ApiError;
			const fieldErrors = mapServerFormErrors(apiError.response?.data);

			if (fieldErrors.general) {
				notify('error', fieldErrors.general);
			} else {
				Object.entries(fieldErrors).forEach(([field, msg]) => {
					form.setFields([
						{
							name: field,
							errors: [msg],
						},
					]);
				});
			}
		},
	});

	const handleLogin = (values: { email: string; password: string }) => {
		mutation.mutate(values);
	};

	return (
		<Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
			<Col xs={22} sm={16} md={12} lg={8}>
				<Card variant="outlined" style={{ borderRadius: 8 }}>
					<Space
						direction="vertical"
						size="large"
						style={{ width: '100%' }}
					>
						<Title level={3} style={{ textAlign: 'center' }}>
							Login
						</Title>

						<Form
							form={form}
							onFinish={handleLogin}
							layout="vertical"
						>
							<Form.Item
								name="email"
								rules={[
									{
										required: true,
										message: 'Please input your email!',
									},
									{
										type: 'email',
										message: 'Invalid email!',
									},
								]}
							>
								<Input
									type="email"
									placeholder="Enter your email"
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
										message: 'Please input your password!',
									},
									{
										min: 6,
										message:
											'Password must be at least 6 characters',
									},
								]}
							>
								<Input.Password
									placeholder="Enter your password"
									prefix={
										<LockOutlined
											style={{ color: '#f65f42' }}
										/>
									}
								/>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									block
									icon={<LoginOutlined />}
									loading={mutation.isPending}
									style={{
										background: '#f65f42',
										borderColor: '#f65f42',
									}}
								>
									{mutation.isPending
										? 'Logging in...'
										: 'Login'}
								</Button>
							</Form.Item>
						</Form>

						<Text style={{ textAlign: 'center', display: 'block' }}>
							Don&apos;t have an account?{' '}
							<Link to="/signup">Sign up</Link>
						</Text>
					</Space>
				</Card>
			</Col>
		</Row>
	);
};

export default Login;
