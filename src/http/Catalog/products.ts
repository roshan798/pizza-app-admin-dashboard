import api from '../index';
import CONFIG from '../../config';

export const fetchProducts = async () => {
	return await api.get(CONFIG.products.url);
};

export const fetchProductById = async (id: string) => {
	return await api.get(CONFIG.products.url + '/' + id);
};
//TODO GIVE TYPE
export const createProduct = async (payload: unknown) => {
	return await api.post(CONFIG.products.url, payload, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};
export const updateProduct = async (id: string, payload: unknown) => {
	return await api.put(CONFIG.products.url + '/' + id, payload, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

export const deleteProduct = async (id: string) => {
	return await api.delete(CONFIG.products.url + '/' + id);
};
