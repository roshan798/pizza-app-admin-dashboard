import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
	HomeOutlined,
	TeamOutlined,
	BankOutlined,
	UnorderedListOutlined,
	ShoppingOutlined,
	TagOutlined,
	FileTextOutlined
} from '@ant-design/icons';
import { useThemeStore } from '../store/useThemeStore';

const sidebarLinks = [
	{ to: '/', label: 'Dashboard', icon: HomeOutlined },
	{ to: '/users', label: 'Users', icon: TeamOutlined },
	{ to: '/tenants', label: 'Tenants', icon: BankOutlined },
	{ to: '/categories', label: 'Categories', icon: UnorderedListOutlined },
	{ to: '/products', label: 'Products', icon: ShoppingOutlined },
	{ to: '/toppings', label: 'Toppings', icon: TagOutlined }, 
	{ to: '/orders', label: 'Orders', icon: FileTextOutlined },
]

const Sidebar: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { resolved: theme } = useThemeStore();

	return (
		<Menu
			className="custom-sidebar-menu"
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
				// create icon element with consistent sizing
				icon: React.createElement(link.icon, {
					style: { fontSize: 22 },
				}),
				// add accessible label and title for screen readers / tooltips
				label: (
					<span
						aria-label={`Navigate to ${link.label}`}
						title={link.label}
						style={{ fontSize: 18 }}
					>
						{link.label}
					</span>
				),
				onClick: () => navigate(link.to),
			}))}
		/>
	);
};

export default Sidebar;
