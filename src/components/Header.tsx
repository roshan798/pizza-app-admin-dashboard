import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { logout as logoutFromServer, self } from '../http/auth';
import { useUserStore } from '../store/userStore';
import { useNotification } from '../hooks/useNotification';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
const { Header: AntHeader } = Layout;

const Header = () => {
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const notify = useNotification();
	const isLoginPage = location.pathname === '/login';
	const isSignupPage = location.pathname === '/signup';
	const { logout, setUser, user } = useUserStore();
	const { data, error } = useQuery({
		queryKey: ['self'],
		queryFn: self,
		staleTime: 1000 * 60 * 5,
		retry: false,
		enabled: !user,
	});
	useEffect(() => {
		if (data) {
			setUser(data.data.user);
		}
	}, [data, setUser]);

	useEffect(() => {
		if (error) {
			console.error('Failed to fetch user', error);
		}
	}, [error]);
	const handleLogout = async () => {
		try {
			const res = await logoutFromServer();
			queryClient.removeQueries({ queryKey: ['self'] });
			console.log(res);
			logout();
			notify('success', 'Logout successful');
			navigate('/login');
		} catch (err) {
			console.error(err);
			notify('error', 'Something bad happened!');
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
