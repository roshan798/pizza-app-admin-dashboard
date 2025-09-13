import { Layout } from 'antd';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AuthLayout = () => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header />
			<Content>
				<Outlet />
			</Content>
			<Footer />
		</Layout>
	);
};

export default AuthLayout;
