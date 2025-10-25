import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNotification } from '../../../hooks/useNotification';
import {
	fetchToppings as fetchToppingsAPI,
	deleteTopping,
} from '../../../http/Catalog/toppings';
import type { Topping } from '../../../http/Catalog/types';

export function useToppings() {
	const queryClient = useQueryClient();
	const notify = useNotification();

	const { data: toppings = [], isLoading } = useQuery({
		queryKey: ['toppings'],
		queryFn: async (): Promise<Topping[]> => {
			const res = await fetchToppingsAPI();
			return res.data.data as Topping[];
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteTopping(id),
		onSuccess: () => {
			message.success('Topping deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['toppings'] });
		},
		onError: () => {
			notify('error', 'Failed to delete topping');
		},
	});

	return { toppings, isLoading, deleteMutation } as const;
}
