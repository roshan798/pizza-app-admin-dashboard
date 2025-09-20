import api from '../index';
import CONFIG from '../../config';

export const fetchCategories = async () => {
	return await api.get(CONFIG.categories.url);
};
export const fetchCategoriesList = async () => {
	return await api.get(CONFIG.categories.list);
};

export const fetchCategoryById = async (id: string) => {
	return await api.get(CONFIG.categories.url + '/' + id);
};

//TODO GIVE TYPE

export const createCategory = async (payload: unknown) => {
	return await api.post(CONFIG.categories.url, payload);
};
export const updateCategory = async (id: string, payload: unknown) => {
	return await api.put(CONFIG.categories.url + '/' + id, payload);
};

export const deleteCategory = async (id: string) => {
	return await api.delete(CONFIG.categories.url + '/' + id);
};
