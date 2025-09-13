import api from '.';
import CONFIG from '../config';
import type { Tenant } from '../pages/tenants/types/types';

export const getAllTenants = async () => {
	return await api.get(CONFIG.tenants.url);
};

export const getTenantById = async (tenantId: string) => {
	return await api.get(CONFIG.tenants.url + '/' + tenantId);
};

export const createTenant = async (data: Partial<Tenant>) => {
	return await api.post(CONFIG.tenants.url, data);
};

export const updateTenant = async (tenantId: number, data: Partial<Tenant>) => {
	return await api.put(CONFIG.tenants.url + '/' + tenantId, data);
};

export const deleteTenant = async (tenantId: number) => {
	return await api.delete(CONFIG.tenants.url + '/' + tenantId);
};
