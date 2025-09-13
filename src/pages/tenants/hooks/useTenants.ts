import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tenant } from '../types/types';
import {
	createTenant,
	deleteTenant,
	getAllTenants,
	updateTenant,
} from '../../../http/tenants';

const fetchTenants = async (): Promise<Tenant[]> => {
	const res = await getAllTenants();
	return res.data.tenants;
};

export function useTenants() {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ['tenants'],
		queryFn: fetchTenants,
	});

	const create = useMutation({
		mutationFn: createTenant,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['tenants'] }),
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<Tenant> }) =>
			updateTenant(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['tenants'] }),
	});

	const remove = useMutation({
		mutationFn: deleteTenant,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['tenants'] }),
	});

	return {
		tenants: data || [],
		isLoading,
		error,
		create,
		update,
		remove,
	};
}
