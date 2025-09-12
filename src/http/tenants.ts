import api from '.';
import CONFIG from '../config';

export const getAllTenants = async () => {
	return await api.get(CONFIG.tenants.url);
};

export const getTenantById = async (tenantId: string) => {
	return await api.get(CONFIG.tenants.url + '/' + tenantId);
};
