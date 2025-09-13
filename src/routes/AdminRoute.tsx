import { Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import ErrorPage from '../pages/ErrorPage';

const AdminRoute = () => {
	const { user } = useUserStore();
	if (!user) return null;
	if (user.role !== 'admin')
		return (
			<ErrorPage status={403} message="You are not authorized as admin" />
		);
	return <Outlet />;
};

export default AdminRoute;
