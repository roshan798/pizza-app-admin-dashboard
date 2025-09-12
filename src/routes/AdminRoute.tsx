import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function AdminRoute() {
	const { user } = useUserStore((state) => state);

	if (!user || user.role !== 'admin') {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
}
