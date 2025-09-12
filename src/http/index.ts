import axios from 'axios';
import CONFIG from '../config.ts';

const api = axios.create({
	baseURL: CONFIG.baseUrl,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	withCredentials: true,
});

api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status === 401 &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				await axios.post(
					`${CONFIG.baseUrl + CONFIG.auth.refresh}`,
					{}, // empty body
					{
						withCredentials: true,
					}
				);
				return api.request(originalRequest);
			} catch (error) {
				console.log('Inteceptor Error', error);
			}
		}
		throw error;
	}
);

export default api;
