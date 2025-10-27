import { useLocation, useNavigate } from 'react-router-dom';
import {
	Layout,
	Button,
	Avatar,
	Dropdown,
	Typography,
	Space,
	Select,
	Tag,
} from 'antd';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useThemeStore } from '../store/useThemeStore';
import type { MenuProps } from 'antd';
import { getTenantById } from '../http/Auth/tenants';
import type { Tenant } from '../pages/tenants/types/types';

const { Header } = Layout;
const { Text } = Typography;
const { Option } = Select;

const AppHeader = () => {
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const notify = useNotification();

	const isLoginPage = location.pathname === '/login';
	const { logout, user } = useUserStore();
	let tenantId = null;
	if (user?.role === 'manager') tenantId = user.tenantId;
	const { mode, setMode } = useThemeStore();
	const { data: tenant } = useQuery({
		queryKey: ['tenant', user?.tenantId],
		enabled: !!tenantId,
		queryFn: () =>
			getTenantById(tenantId!).then((res) => {
				const tenantData = res.data.tenant as Tenant;
				console.log('Fetched tenant data:', tenantData);
				return tenantData;
			}),
	});

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
			key: 'theme_header',
			label: 'Theme',

			children: [
				{
					key: 'theme_light',
					icon: <BulbOutlined />,
					label: 'Light',
					onClick: () => setMode('light'),
				},
				{
					key: 'theme_dark',
					icon: <MoonOutlined />,
					label: 'Dark',
					onClick: () => setMode('dark'),
				},
				{
					key: 'theme_system',
					icon: <LaptopOutlined />,
					label: 'System',
					onClick: () => setMode('system'),
				},
			],
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
				},
				{ type: 'divider' },

				// Theme group
				...themeItems,
				{ type: 'divider' },

				// Logout
				{
					key: 'logout',
					icon: <LogoutOutlined />,
					label: 'Logout',
					onClick: handleLogout,
				},
			]
		: [
				// If not logged in, you could still show theme here, or keep empty and show Login button outside.
				...themeItems,
			];

	// ...
	const formatAddress = (addr?: string) => {
		if (!addr) return '';
		const [first = '', second = ''] = addr.split(',').map((s) => s.trim());
		return second ? `${first}, ${second}` : first;
	};

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
				background: mode !== 'dark' ? '#424242' : '#fff',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					minWidth: 0,
				}}
			>
				<Text
					style={{
						fontSize: 28,
						color: '#f65f42',
						fontWeight: 900,
						whiteSpace: 'nowrap',
					}}
				>
					PizzaDash
				</Text>

				{tenant && (
					<Tag
						style={{
							margin: 0,
							marginLeft: 24,
							borderRadius: 999,
							padding: '2px 10px',
							fontSize: 12,
							lineHeight: '16px',
							maxWidth: 240,
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							background: '#f65f4240',
							borderColor: 'transparent',
							color: mode === 'dark' ? '#f65f42' : '#f65f42',
						}}
					>
						{formatAddress(tenant?.address)}
					</Tag>
				)}
			</div>

			<Space size="large">
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
								border: `2px solid #f65f42`,
								backgroundColor: ['dark', 'system'].includes(
									mode
								)
									? '#333'
									: undefined,
								cursor: 'pointer',
							}}
						/>
					</Dropdown>
				) : (
					<>
						<Select
							placeholder="Please select theme"
							value={mode}
							onSelect={(value) => {
								setMode(value);
							}}
						>
							<Option value="light">Light</Option>
							<Option value="dark">Dark</Option>
						</Select>
						<Button
							type="primary"
							icon={
								!isLoginPage ? (
									<LoginOutlined />
								) : (
									<UserOutlined />
								)
							}
							onClick={() =>
								navigate(!isLoginPage ? '/login' : '/signup')
							}
							style={{
								background: '#f65f42',
								borderColor: '#f65f42',
							}}
						>
							{!isLoginPage ? 'Login' : 'Sign Up'}
						</Button>
					</>
				)}
			</Space>
		</Header>
	);
};

export default AppHeader;
