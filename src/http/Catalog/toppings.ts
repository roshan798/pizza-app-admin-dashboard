import api from '../index';
import CONFIG from '../../config';

export const fetchToppings = async () => {
	return await api.get(CONFIG.toppings.url);
};

export const fetchToppingById = async (id: string) => {
	return await api.get(`${CONFIG.toppings.url}/${id}`);
};

// payload is FormData
export const createTopping = async (payload: unknown) => {
	return await api.post(CONFIG.toppings.url, payload, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

export const updateTopping = async (id: string, payload: unknown) => {
	return await api.put(`${CONFIG.toppings.url}/${id}`, payload, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

export const deleteTopping = async (id: string) => {
	return await api.delete(`${CONFIG.toppings.url}/${id}`);
};
