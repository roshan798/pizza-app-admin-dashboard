import {
	Card,
	Col,
	Row,
	Statistic,
	Table,
	List,
	Typography,
	Tag,
	Spin,
	message,
	Space,
} from 'antd';
import {
	UserOutlined,
	ApartmentOutlined,
	ShoppingCartOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../http/users';
import type { User } from '../store/userStore';

const { Title } = Typography;

const Home = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	// Dummy fallback data
	const fallbackData: User[] = [
		{
			id: '1',
			firstName: 'Alice',
			lastName: 'Singh',
			role: 'admin',
			createdAt: new Date(),
			updatedAt: new Date(),
			email: 'test@gmail.com',
		},
		{
			id: '2',
			firstName: 'Bob',
			lastName: 'Singh',
			role: 'manager',
			createdAt: new Date(),
			updatedAt: new Date(),
			email: 'test@gmail.com',
		},
		{
			id: '3',
			firstName: 'Charlie',
			lastName: 'Singh',
			role: 'customer',
			createdAt: new Date(),
			updatedAt: new Date(),
			email: 'test@gmail.com',
		},
	];

	// Columns for AntD Table
	const columns = [
		{ title: 'ID', dataIndex: 'id', key: 'id' },
		{
			title: 'Name',
			key: 'name',
			render: (_: unknown, record: User) => (
				<span>
					{record.firstName} {record.lastName}
				</span>
			),
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			render: (role: string) => {
				const color =
					role === 'admin'
						? 'red'
						: role === 'manager'
							? 'blue'
							: 'green';
				const formattedRole =
					role.charAt(0).toUpperCase() + role.slice(1);
				return <Tag color={color}>{formattedRole}</Tag>;
			},
		},
	];

	// Recent Activity (can also fetch if API available)
	const activities = [
		'Alice created a new user',
		'Bob updated tenant details',
		'Charlie placed an order',
	];

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await getAllUsers();
				setUsers(res.data.users);
			} catch (err) {
				console.error(
					'[Home] Failed to fetch users, using dummy:',
					err
				);
				message.warning('Showing fallback user data');
				setUsers(fallbackData);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Space
			direction="vertical"
			size="large"
			style={{ width: '100%', padding: 24 }}
		>
			{/* Page Title */}
			<Title level={2}>Dashboard Overview</Title>

			{/* Stats Section */}
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={8}>
					<Card>
						<Statistic
							title="Total Users"
							value={Math.floor(Math.random() * 1000)}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#3f8600' }}
							suffix={<ArrowUpOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Card>
						<Statistic
							title="Active Tenants"
							value={Math.floor(Math.random() * 500)}
							prefix={<ApartmentOutlined />}
							valueStyle={{ color: '#1890ff' }}
							suffix={<ArrowUpOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Card>
						<Statistic
							title="Pending Orders"
							value={Math.floor(Math.random() * 200)}
							prefix={<ShoppingCartOutlined />}
							valueStyle={{ color: '#cf1322' }}
							suffix={<ArrowDownOutlined />}
						/>
					</Card>
				</Col>
			</Row>

			{/* Main Content Section */}
			<Row gutter={[16, 16]}>
				{/* Users Overview Table */}
				<Col xs={24} lg={14}>
					<Card
						title="Users Overview"
						variant="outlined"
						style={{ borderRadius: 8 }}
					>
						<Spin spinning={loading}>
							<Table
								dataSource={users}
								columns={columns}
								pagination={false}
								rowKey="id"
							/>
						</Spin>
					</Card>
				</Col>

				{/* Recent Activity List */}
				<Col xs={24} lg={10}>
					<Card
						title="Recent Activity"
						variant="outlined"
						style={{ borderRadius: 8 }}
					>
						<List
							dataSource={activities}
							renderItem={(item) => <List.Item>{item}</List.Item>}
						/>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};

export default Home;
