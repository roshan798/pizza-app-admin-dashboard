import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Typography, Divider } from 'antd';
import { PriceConfigs } from './sections/PriceConfigs';
import { Attributes } from './sections/Attributes';
import type { Category } from '../../../../http/Catalog/types';
import {
	createCategory,
	updateCategory,
} from '../../../../http/Catalog/categories';

const { Title } = Typography;

interface PriceConfigFormItem {
	key: string;
	priceType: Category['priceConfiguration'][string]['priceType'];
	availableOptions: string;
}

interface AttributeFormItem {
	name: string;
	widgetType: Category['attributes'][number]['widgetType'];
	defaultValue: string;
	availableOptions: string;
}

interface CategoryFormValues {
	name: string;
	priceConfiguration: PriceConfigFormItem[];
	attributes: AttributeFormItem[];
}

interface Props {
	mode: 'create' | 'update';
	initialCategory?: Category;
	onSuccess?: () => void;
}

export function CreateOrUpdateCategoryForm({
	mode,
	initialCategory,
	onSuccess,
}: Props) {
	const [form] = Form.useForm<CategoryFormValues>();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: Category) => {
			if (mode === 'create') return createCategory(payload);
			if (mode === 'update' && initialCategory?.id)
				return updateCategory(initialCategory.id, payload);
			throw new Error('Invalid mutation call: no category ID for update');
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			form.resetFields();
			onSuccess?.();
		},
	});

	const transformToFormValues = (category: Category): CategoryFormValues => ({
		name: category.name,
		priceConfiguration: Object.entries(category.priceConfiguration).map(
			([key, cfg]) => ({
				key,
				priceType: cfg.priceType,
				availableOptions: cfg.availableOptions.join(', '),
			})
		),
		attributes: category.attributes.map((attr) => ({
			...attr,
			availableOptions: attr.availableOptions.join(', '),
		})),
	});

	const handleSubmit = (values: CategoryFormValues) => {
		const priceConfig: Category['priceConfiguration'] = {};
		values.priceConfiguration.forEach((item) => {
			priceConfig[item.key] = {
				priceType: item.priceType,
				availableOptions: item.availableOptions
					.split(',')
					.map((opt) => opt.trim()),
			};
		});

		const attributes: Category['attributes'] = values.attributes.map(
			(attr) => ({
				...attr,
				availableOptions: attr.availableOptions
					.split(',')
					.map((opt) => opt.trim()),
			})
		);

		const payload: Category = {
			...(initialCategory ?? {}),
			name: values.name,
			priceConfiguration: priceConfig,
			attributes,
		};

		mutation.mutate(payload);
	};

	return (
		<Card>
			<Title level={4}>
				{mode === 'create' ? 'Create Category' : 'Update Category'}
			</Title>

			<Form<CategoryFormValues>
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={
					initialCategory
						? transformToFormValues(initialCategory)
						: { priceConfiguration: [], attributes: [] }
				}
			>
				{/* Category name */}
				<Form.Item
					label="Category Name"
					name="name"
					rules={[
						{
							required: true,
							message: 'Please enter category name',
						},
					]}
				>
					<Input placeholder="e.g. Pizza" />
				</Form.Item>

				{/* Price Configurations */}
				<Divider>Price Configurations</Divider>
				<PriceConfigs />

				{/* Attributes */}
				<Divider>Attributes</Divider>
				<Attributes />

				{/* Submit */}
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={mutation.isPending}
					>
						{mode === 'create' ? 'Create' : 'Update'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
