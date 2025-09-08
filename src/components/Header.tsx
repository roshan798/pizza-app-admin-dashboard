import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { logout as logoutFromServer } from '../http/auth';
import { useUserStore } from '../store/userStore';
import { useNotification } from '../hooks/useNotification';

const { Header: AntHeader } = Layout;

const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const notify = useNotification();
	const isLoginPage = location.pathname === '/login';
	const isSignupPage = location.pathname === '/signup';
	const { logout } = useUserStore();
	const handleLogout = async () => {
		try {
			await logoutFromServer();
			notify('success', 'Logout succesfull');
		} catch (error) {
			console.error(error);
			notify('error', 'Something bad happend!');
		} finally {
			logout();
			navigate('/login');
		}
	};

	return (
		<AntHeader
			style={{
				background: '#fff',
				position: 'sticky',
				top: 0,
				zIndex: 10,
				padding: '0 32px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				height: 64,
			}}
		>
			{/* Left: Logo */}
			<div style={{ fontSize: 28, fontWeight: 700, color: '#f65f42' }}>
				PizzaDash
			</div>

			{/* Right: Navigation */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
				<Menu
					mode="horizontal"
					selectedKeys={[location.pathname]}
					style={{
						borderBottom: 'none',
						fontSize: 18,
						minWidth: 200,
					}}
				>
					{!isLoginPage && !isSignupPage && (
						<Menu.Item
							key="logout"
							onClick={handleLogout}
							icon={<LogoutOutlined />}
							style={{ color: '#f65f42' }}
						>
							Logout
						</Menu.Item>
					)}
				</Menu>

				{isLoginPage ? (
					<Button
						type="primary"
						icon={<UserOutlined />}
						style={{
							background: '#f65f42',
							borderColor: '#f65f42',
						}}
						onClick={() => navigate('/signup')}
					>
						Sign up
					</Button>
				) : isSignupPage ? (
					<Button
						type="primary"
						icon={<LoginOutlined />}
						style={{
							background: '#f65f42',
							borderColor: '#f65f42',
						}}
						onClick={() => navigate('/login')}
					>
						Login
					</Button>
				) : null}

				<Avatar
					src="https://i.pravatar.cc/32"
					size={40}
					style={{ border: '2px solid #f65f42' }}
				/>
			</div>
		</AntHeader>
	);
};

export default Header;
