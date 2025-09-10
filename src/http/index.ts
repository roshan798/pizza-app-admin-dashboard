import axios from 'axios';
import CONFIG from '../config.ts';

export const auth = axios.create({
	baseURL: CONFIG.auth.url,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	withCredentials: true,
});

auth.interceptors.response.use(
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
					`${CONFIG.auth.url + CONFIG.auth.refresh}`,
					{},
					{
						withCredentials: true,
					}
				);
				return auth.request(originalRequest);
			} catch (error) {
				console.log('Inteceptor Error', error);
			}
		}
		throw error;
	}
);
