import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Roles } from '../types';

interface ProtectedRouteProps {
	allowed?: Roles[];
	redirectTo?: string;
	unauthorizedTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	allowed,
	redirectTo = '/login',
	unauthorizedTo = '/unauthorized',
}) => {
	const { isAuthenticated, roles } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	if (!allowed || allowed.length === 0) {
		return <Outlet />;
	}
	if (roles.some((r) => allowed.includes(r))) {
		return <Outlet />;
	}

	return <Navigate to={unauthorizedTo} replace />;
};

export default ProtectedRoute;
