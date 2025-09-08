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
