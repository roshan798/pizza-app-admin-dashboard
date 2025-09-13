import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const AuthRoute = () => {
	const { user } = useUserStore();
	console.log('[AUTH ROUTE] ', user);
	if (user) return <Navigate to="/" />;

	return <Outlet />;
};

export default AuthRoute;
