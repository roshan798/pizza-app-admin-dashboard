import api from '../index';
import CONFIG from '../../config';

export const fetchProducts = async (
	params: GetAllFilters | undefined | null
) => {
	if (!params) {
		return await api.get(CONFIG.products.url);
	}
	const {
		page = 1,
		limit = 100,
		skip = 0,
		order = 'asc',
		sortBy = 'createdAt',
		tenantId,
		categoryId,
		name,
		isPublished,
	} = params;
	return await api.get(CONFIG.products.url, {
		params: {
			page,
			limit,
			skip,
			order,
			sortBy,
			tenantId,
			categoryId,
			name,
			isPublished,
		},
	});
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

export type SortBy = 'name' | 'createdAt' | 'categoryId' | 'isPublished';
export type SortOrder = 'asc' | 'desc';
export type ProductQueryParams = {
	page?: number;
	perPage?: number;
	sortBy?: SortBy;
	q?: string;
	categories?: string[];
	skip?: number;
	limit?: number;
	order?: SortOrder;
	tenantId?: string;
	categoryId?: string;
	name?: string;
	isPublished?: boolean;
};

export type GetAllFilters = Required<
	Pick<ProductQueryParams, 'page' | 'limit' | 'skip' | 'order' | 'sortBy'>
> &
	Pick<
		ProductQueryParams,
		'tenantId' | 'categoryId' | 'name' | 'isPublished'
	>;

export type GetAllServiceResult<T> = {
	items: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
};
