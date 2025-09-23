import { useUserStore } from '../store/userStore';

// export type Role = 'admin' | 'manager' | 'user';

export function useAuth() {
	// Replace with your actual user store logic
	const { id, user } = useUserStore();
	// user.role is a string like 'admin', 'manager', or 'user'
	const role = user?.role;
	return {
		isAuthenticated: !!id || !!user,
		roles: role ? [role] : [],
	};
}
