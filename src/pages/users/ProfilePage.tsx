import { Button, Card, Col, Form, Input, Row, Typography, Upload } from 'antd';
import { useUserStore, type User } from '../../store/userStore';
import { useNotification } from '../../hooks/useNotification';
import { useQuery, useMutation } from '@tanstack/react-query';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { type RcFile } from 'antd/es/upload/interface';
import { self } from '../../http/Auth/auth';

const { Title } = Typography;

// --- Types ---

interface ProfileFormValues {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	password?: string;
	confirmPassword?: string;
	avatar?: RcFile;
}

interface ApiResponse<T> {
	data: T;
}

async function updateSelf(
	values: ProfileFormValues
): Promise<ApiResponse<{ user: User }>> {
	await new Promise((res) => setTimeout(res, 500));
	return {
		data: {
			user: {
				id: '1',
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				role: 'customer',
				createdAt: new Date(Date.now()),
				updatedAt: new Date(Date.now()),
			},
		},
	};
}

// --- Component ---
export default function ProfilePage() {
	const { user, setUser } = useUserStore();
	const notify = useNotification();

	const { data } = useQuery({
		queryKey: ['self'],
		queryFn: self,
		staleTime: 1000 * 60 * 5,
	});

	const mutation = useMutation({
		mutationFn: updateSelf,
		onSuccess: (res) => {
			setUser(res.data.user);
			notify('success', 'Profile updated successfully!');
		},
		onError: () => notify('error', 'Failed to update profile'),
	});

	const onFinish = (values: ProfileFormValues) => {
		mutation.mutate(values);
	};

	return (
		<div className="p-6">
			<Title level={3}>Update Profile</Title>
			<Form
				layout="vertical"
				initialValues={user || data?.data.user}
				onFinish={onFinish}
			>
				<Row gutter={24}>
					{/* Basic Info */}
					<Col span={12}>
						<Card title="Basic Info">
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item
										name="firstName"
										label="First Name"
										rules={[{ required: true }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="lastName"
										label="Last Name"
										rules={[{ required: true }]}
									>
										<Input />
									</Form.Item>
								</Col>
							</Row>
							<Form.Item
								name="email"
								label="Email"
								rules={[{ type: 'email', required: true }]}
							>
								<Input disabled />
							</Form.Item>
						</Card>
					</Col>

					{/* Profile Image */}
					<Col span={12}>
						<Card title="Profile Image">
							<Upload maxCount={1} beforeUpload={() => false}>
								<Button icon={<UploadOutlined />}>
									Click or drag to upload
								</Button>
							</Upload>
						</Card>
					</Col>
				</Row>

				{/* Security Info */}
				<Row gutter={24} className="mt-6">
					<Col span={24}>
						<Card title="Security Info">
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item name="password" label="Password">
										<Input.Password />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="confirmPassword"
										label="Confirm Password"
									>
										<Input.Password />
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>

				{/* Actions */}
				<div className="flex justify-end gap-4 mt-6">
					<Button
						htmlType="button"
						onClick={() => window.history.back()}
					>
						Cancel
					</Button>
					<Button
						type="primary"
						htmlType="submit"
						icon={<SaveOutlined />}
						loading={mutation.isPending}
						style={{
							background: '#f65f42',
							borderColor: '#f65f42',
						}}
					>
						Save
					</Button>
				</div>
			</Form>
		</div>
	);
}
