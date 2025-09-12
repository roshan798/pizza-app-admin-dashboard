import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function AuthRoute() {
	const { user } = useUserStore((state) => state);
	if (user) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}
