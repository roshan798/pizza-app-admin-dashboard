import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNotification } from '../../../hooks/useNotification';
import {
	fetchProducts as fetchProductsAPI,
	deleteProduct,
} from '../../../http/Catalog/products';
import type { Product } from '../../../http/Catalog/types';

export function useProducts() {
	const queryClient = useQueryClient();
	const notify = useNotification();

	const { data: products = [], isLoading } = useQuery({
		queryKey: ['products'],
		queryFn: async (): Promise<Product[]> => {
			const res = await fetchProductsAPI();
			return res.data.data as Product[];
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => {
			message.success('Product deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: () => {
			notify('error', 'Failed to delete product');
		},
	});

	return { products, isLoading, deleteMutation } as const;
}
