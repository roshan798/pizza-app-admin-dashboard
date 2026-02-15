import api from '../index';
import CONFIG from '../../config';

export const fetchOrders = async (params: string) => {
	return await api.get(CONFIG.orders.url + '?' + params);
};

export const fetchOrderById = async (id: string) => {
	return await api.get(CONFIG.orders.url + '/' + id);
};

export const updateOrderStatus = async (id: string, status: string) => {
	return await api.patch(CONFIG.orders.url + '/' + id, {
		orderStatus: status,
	});
};

export const cancelOrder = async (id: string) => {
	return await api.delete(CONFIG.orders.url + '/' + id);
};
