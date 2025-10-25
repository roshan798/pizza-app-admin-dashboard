import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, type UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import type {
	Category,
	CategoryListItem,
	Product,
} from '../../../http/Catalog/types';
import {
	fetchCategoriesList,
	fetchCategoryById,
} from '../../../http/Catalog/categories';
import { fetchProductById } from '../../../http/Catalog/products';
export interface ProductFormValues {
	name: string;
	description: string;
	categoryId: string;
	image?: UploadFile[];
	// priceConfiguration form shape:
	// - If a group has options: Record<optionName, price number|string>
	// - If a group has single numeric price: just a number (or string) under that group key
	priceConfiguration?: Record<
		string,
		Record<string, string | number> | string | number
	>;
	// attributes shape: Record<attributeName, value>
	attributes?: Record<string, string | number | boolean>;
	isPublished: boolean;
	tenantId: string;
}

export const useProductFormData = (
	form: ReturnType<typeof Form.useForm>[0]
) => {
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const isEdit = Boolean(id);

	const [selectedCategoryId, setSelectedCategoryId] = useState<
		string | undefined
	>(undefined);
	const [selectedTenantId, setSelectedTenantId] = useState<
		string | undefined
	>(undefined);
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const { data: existingProduct, isLoading: loadingProduct } =
		useQuery<Product>({
			queryKey: ['products', 'detail', id],
			queryFn: async () => {
				const res = await fetchProductById(id!);
				return res.data.data as Product;
			},
			enabled: isEdit,
			staleTime: 5 * 60 * 1000,
		});

	const { data: categoryList, isLoading: loadingList } = useQuery<
		CategoryListItem[]
	>({
		queryKey: ['categories', 'list'],
		queryFn: async () => {
			const res = await fetchCategoriesList();
			return res.data.data as CategoryListItem[];
		},
		staleTime: 5 * 60 * 1000,
	});

	const { data: selectedCategory, isLoading: loadingDetail } =
		useQuery<Category>({
			queryKey: ['categories', 'detail', selectedCategoryId],
			queryFn: async () => {
				const res = await fetchCategoryById(selectedCategoryId!);
				return res.data.data as Category;
			},
			enabled: !!selectedCategoryId,
			staleTime: 5 * 60 * 1000,
		});

	useEffect(() => {
		if (existingProduct) {
			form.setFieldsValue({
				name: existingProduct.name,
				description: existingProduct.description,
				categoryId: existingProduct.categoryId,
				isPublished: existingProduct.isPublished || true,
				tenantId: existingProduct.tenantId,
			});
			setSelectedCategoryId(existingProduct.categoryId);
			setSelectedTenantId(existingProduct.tenantId);
		} else if (!isEdit) {
			form.resetFields();
			form.setFieldsValue({ isPublished: true });
			setSelectedCategoryId(undefined);
			setSelectedTenantId(undefined);
			setFileList([]);
		}
	}, [existingProduct, isEdit, form]);

	useEffect(() => {
		if (isEdit && existingProduct?.imageUrl) {
			const seeded: UploadFile[] = [
				{
					uid: '-1',
					name: 'current-image',
					status: 'done',
					url: existingProduct.imageUrl,
				},
			];
			setFileList(seeded);
			form.setFieldsValue({ image: seeded });
		}
	}, [isEdit, existingProduct, form]);

	useEffect(() => {
		form.setFieldsValue({
			priceConfiguration: undefined,
			attributes: undefined,
		});
	}, [selectedCategoryId, form]);

	useEffect(() => {
		if (!isEdit || !existingProduct || !selectedCategory) return;

		const pcForm: ProductFormValues['priceConfiguration'] = {};
		Object.entries(selectedCategory.priceConfiguration).forEach(
			([groupKey]) => {
				const productGroup =
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(existingProduct.priceConfiguration as any)[groupKey];
				if (!productGroup) return;
				const productOpts = productGroup.availableOptions as Record<
					string,
					number
				>;
				const optEntries = Object.entries(productOpts);
				if (optEntries.length === 1) {
					const [, price] = optEntries[0];
					pcForm![groupKey] = price;
				} else if (optEntries.length > 1) {
					pcForm![groupKey] = optEntries.reduce<
						Record<string, number>
					>((acc, [opt, price]) => {
						acc[opt] = price;
						return acc;
					}, {});
				}
			}
		);

		const attrsForm: ProductFormValues['attributes'] = {};
		(existingProduct.attributes ?? []).forEach((a) => {
			attrsForm![a.name] = a.value as string | number | boolean;
		});

		form.setFieldsValue({
			priceConfiguration: pcForm,
			attributes: attrsForm,
		});
	}, [isEdit, existingProduct, selectedCategory, form]);

	return {
		isEdit,
		navigate,
		selectedCategoryId,
		setSelectedCategoryId,
		fileList,
		setFileList,
		loadingProduct,
		loadingList,
		loadingDetail,
		existingProduct,
		categoryList,
		selectedCategory,
		id,
		selectedTenantId,
		setSelectedTenantId,
	};
};
