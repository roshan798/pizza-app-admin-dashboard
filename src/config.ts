const CONFIG = {
	baseUrl: 'http://localhost:8000/api',
	auth: {
		login: '/auth/auth/login',
		signup: '/auth/auth/register',
		self: '/auth/auth/self',
		logout: '/auth/auth/logout',
		refresh: '/auth/auth/refresh',
	},
	users: {
		url: '/auth/users',
	},
	tenants: {
		url: '/auth/tenants',
	},
	categories: {
		url: '/catalog/categories',
		list: '/catalog/categories/list',
	},
	products: {
		url: '/catalog/products',
	},
};
export default CONFIG;
