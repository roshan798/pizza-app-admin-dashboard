import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { self } from '../http/auth';

export default function AuthRoute() {
	console.log('Public ROUTE');
	const { setUser } = useUserStore();
	const { id, user } = useUserStore((state) => state);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			if (user === null && id) {
				try {
					const res = await self();
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

	if (user) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}
