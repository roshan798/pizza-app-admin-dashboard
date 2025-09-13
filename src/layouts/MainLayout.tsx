import { useState } from 'react';
import { Layout } from 'antd';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumb';
import { useThemeStore } from '../store/useThemeStore';

const { Sider, Content } = Layout;

const MainLayout = () => {
	const [sideCollapsed, setSideCollapsed] = useState(false);
	const { resolved: theme } = useThemeStore();
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header />
			<Layout>
				<Sider
					collapsible
					collapsed={sideCollapsed}
					onCollapse={setSideCollapsed}
					theme={theme}
				>
					<Sidebar />
				</Sider>
				<Layout>
					<Content style={{ margin: 24, minHeight: 280 }}>
						<Breadcrumbs />
						<Outlet />
					</Content>
					<Footer />
				</Layout>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
