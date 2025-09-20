import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
	HomeOutlined,
	TeamOutlined,
	ApartmentOutlined,
	AppstoreOutlined,
	ShoppingOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '../store/useThemeStore';

const sidebarLinks = [
	{ to: '/', label: 'Dashboard', icon: <HomeOutlined /> },
	{ to: '/users', label: 'Users', icon: <TeamOutlined /> },
	{ to: '/tenants', label: 'Tenants', icon: <ApartmentOutlined /> },
	{ to: '/categories', label: 'Categories', icon: <AppstoreOutlined /> },
	{ to: '/products', label: 'Products', icon: <ShoppingOutlined /> },
];

const Sidebar: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { resolved: theme } = useThemeStore();

	return (
		<Menu
			mode="inline"
			theme={theme}
			selectedKeys={[location.pathname]}
			style={{
				height: '100%',
				marginTop: 10,
				borderRight: 0,
				fontSize: 18,
			}}
			items={sidebarLinks.map((link) => ({
				key: link.to,
				icon: React.cloneElement(link.icon, {
					style: { fontSize: 22 },
				}),
				label: <span style={{ fontSize: 18 }}>{link.label}</span>,
				onClick: () => navigate(link.to),
			}))}
		/>
	);
};

export default Sidebar;
