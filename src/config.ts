const CONFIG = {
	baseUrl: 'http://localhost:8080',
	auth: {
		url: '/auth/auth',
		login: '/auth/login',
		signup: '/auth/register',
		self: '/auth/self',
		logout: '/auth/logout',
		refresh: '/auth/refresh',
	},
	users: {
		url: '/users',
	},
	tenants: {
		url: '/tenants',
	},
};
export default CONFIG;
