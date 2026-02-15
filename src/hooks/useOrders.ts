import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOrders } from '../http/Orders/orders';
import type { Order, OrderResponse } from '../http/Orders/order-types';
const DEBOUNCE_DELAY = 1000;

export const useOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [paymentStatus, setPaymentStatus] = useState('');
	const [orderStatus, setOrderStatus] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const fetchData = useCallback(
		async (pageNum = page, limitNum = limit) => {
			try {
				setLoading(true);
				const params = new URLSearchParams({
					page: pageNum.toString(),
					limit: limitNum.toString(),
					...(paymentStatus && { paymentStatus }),
					...(orderStatus && { orderStatus }),
					...(searchQuery && { query: searchQuery }),
				});

				const response = await fetchOrders(params.toString());
				const result = response.data as OrderResponse;
				setOrders(result.data);
				setTotal(result.total);
			} catch (error) {
				console.error('Failed to fetch orders:', error);
			} finally {
				setLoading(false);
			}
		},
		[page, limit, paymentStatus, orderStatus, searchQuery]
	);
	const ref = useRef<number | null>(null);
	useEffect(() => {
		if (ref.current) {
			clearTimeout(ref.current);
		}
		ref.current = setTimeout(() => {
			fetchData();
		}, DEBOUNCE_DELAY);
		return () => {
			if (ref.current) {
				clearTimeout(ref.current);
			}
		};
	}, [fetchData]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setPage(1);
	};

	const handlePaymentFilter = (status: string) => {
		setPaymentStatus(status || '');
		setPage(1);
	};

	const handleStatusFilter = (status: string) => {
		setOrderStatus(status || '');
		setPage(1);
	};

	const handlePagination = (newPage: number, newLimit: number) => {
		setPage(newPage);
		setLimit(newLimit);
	};

	const handlePageSize = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
	};

	return {
		orders,
		loading,
		total,
		page,
		limit,
		paymentStatus,
		orderStatus,
		searchQuery,
		handleSearch,
		handlePaymentFilter,
		handleStatusFilter,
		handlePagination,
		handlePageSize,
	};
};
