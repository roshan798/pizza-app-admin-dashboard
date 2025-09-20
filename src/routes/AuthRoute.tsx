import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const AuthRoute = () => {
	const { user } = useUserStore();
	if (user) return <Navigate to="/" />;

	return <Outlet />;
};

export default AuthRoute;
