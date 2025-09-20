// src/pages/categories/CategoryFormPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Alert } from 'antd';
import { fetchCategoryById } from '../../http/Catalog/categories';
import type { Category } from '../../http/Catalog/types';
import CreateOrUpdateCategoryForm from './CreateorUpdateCategory';

const getCategoryById = async (id: string): Promise<Category> => {
	const res = await fetchCategoryById(id);
	return res.data.data;
};

export default function CategoryFormPage() {
	const { id } = useParams<{ id: string }>();
	console.log('Category form page : ', id);
	const navigate = useNavigate();

	const isEdit = Boolean(id);

	const {
		data: category,
		isLoading,
		isError,
	} = useQuery<Category>({
		queryKey: ['categories', id],
		queryFn: () => getCategoryById(id!),
		enabled: isEdit, // only fetch if editing
	});

	if (isEdit && isLoading) return <Spin size="large" />;
	if (isEdit && isError)
		return (
			<Alert type="error" message="Failed to load category" showIcon />
		);

	return (
		<CreateOrUpdateCategoryForm
			mode={isEdit ? 'update' : 'create'}
			initialCategory={category}
			onSuccess={() => navigate('/categories')}
		/>
	);
}
