import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button, Avatar, Dropdown, Typography, Space } from 'antd';
import {
	UserOutlined,
	LogoutOutlined,
	LoginOutlined,
	BulbOutlined,
	MoonOutlined,
	LaptopOutlined,
} from '@ant-design/icons';
import { logout as logoutFromServer } from '../http/Auth/auth';
import { useUserStore } from '../store/userStore';
import { useNotification } from '../hooks/useNotification';
import { useQueryClient } from '@tanstack/react-query';
import { useThemeStore } from '../store/useThemeStore';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const notify = useNotification();

	const isLoginPage = location.pathname === '/login';
	const { logout, user } = useUserStore();
	const { mode, setMode } = useThemeStore();

	const handleLogout = async () => {
		try {
			await logoutFromServer();
			queryClient.removeQueries({ queryKey: ['self'] });
			logout();
			notify('success', 'Logout successful');
			navigate('/login');
		} catch (err) {
			console.error(err);
			notify('error', 'Something went wrong!');
		}
	};

	const themeItems: MenuProps['items'] = [
		{
			key: 'light',
			icon: <BulbOutlined />,
			label: 'Light',
			onClick: () => setMode('light'),
		},
		{
			key: 'dark',
			icon: <MoonOutlined />,
			label: 'Dark',
			onClick: () => setMode('dark'),
		},
		{
			key: 'system',
			icon: <LaptopOutlined />,
			label: 'System',
			onClick: () => setMode('system'),
		},
	];

	const userItems: MenuProps['items'] = user
		? [
				{
					key: 'profile',
					label: (
						<div onClick={() => navigate('/me')}>
							<Text strong>
								{user.firstName} {user.lastName}
							</Text>
							<br />
							<Text type="secondary" style={{ fontSize: 12 }}>
								{user.email}
							</Text>
						</div>
					),
					disabled: false,
				},
				{
					key: 'logout',
					icon: <LogoutOutlined />,
					label: 'Logout',
					onClick: handleLogout,
				},
			]
		: [];

	return (
		<Header
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 10,
				padding: '0 32px',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				background: '#fff',
			}}
		>
			<Text strong style={{ fontSize: 24, color: '#f65f42' }}>
				PizzaDash
			</Text>

			<Space size="large">
				<Dropdown menu={{ items: themeItems }} trigger={['click']}>
					<Button icon={<BulbOutlined />}>
						{mode.charAt(0).toUpperCase() + mode.slice(1)}
					</Button>
				</Dropdown>

				{user ? (
					<Dropdown menu={{ items: userItems }} trigger={['click']}>
						<Avatar
							icon={
								<UserOutlined
									style={{
										color: ['dark', 'system'].includes(mode)
											? '#fff'
											: undefined,
									}}
								/>
							}
							size={40}
							style={{
								border: `2px solid ${['dark', 'system'].includes(mode) ? '#f65f42' : '#f65f42'}`,
								backgroundColor: ['dark', 'system'].includes(
									mode
								)
									? '#333'
									: undefined,
								cursor: 'pointer',
							}}
						/>
					</Dropdown>
				) : isLoginPage ? (
					<Button
						type="primary"
						icon={<UserOutlined />}
						onClick={() => navigate('/signup')}
						style={{
							background: '#f65f42',
							borderColor: '#f65f42',
						}}
					>
						Sign Up
					</Button>
				) : (
					<Button
						type="primary"
						icon={<LoginOutlined />}
						onClick={() => navigate('/login')}
						style={{
							background: '#f65f42',
							borderColor: '#f65f42',
						}}
					>
						Login
					</Button>
				)}
			</Space>
		</Header>
	);
};

export default AppHeader;
