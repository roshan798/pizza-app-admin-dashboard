import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { self } from '../http/auth';

export default function AdminRoute() {
	console.log('ADMIN ROUTE');
	const { setUser } = useUserStore();
	const { id, user } = useUserStore((state) => state);
	console.log('user ID', id, user);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			console.log('going to fetch user : ', user === null && id);
			if (user === null && id) {
				console.log('fetching user');
				try {
					const res = await self();
					console.log(res.data);
					setUser(res.data.user);
				} catch (err) {
					console.error('Failed to fetch user', err);
				}
			}
			setLoading(false);
		};

		fetchUser();
	}, [id, user, setUser]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	if (!user || user.role !== 'admin') {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
}
