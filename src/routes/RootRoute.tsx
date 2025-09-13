import { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { self } from '../http/auth';
import { useUserStore } from '../store/userStore';
import { Spin } from 'antd';

const RootRoute = () => {
	const { user, setUser, id } = useUserStore((state) => state);
	const location = useLocation();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(!user);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		if (!user) {
			setLoading(true);

			self()
				.then((res) => {
					setUser(res.data.user);
					setError(null);

					// Only redirect to home if already on login/signup
					if (
						location.pathname === '/login' ||
						location.pathname === '/signup'
					) {
						navigate('/');
					}
				})
				.catch((err) => {
					setError(err);
				})
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (loading) {
		return (
			<Spin
				size="large"
				style={{ margin: '100px auto', display: 'block' }}
			/>
		);
	}

	if (
		error &&
		location.pathname !== '/login' &&
		location.pathname !== '/signup'
	) {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default RootRoute;
