import { Form, Button, Card, Spin, Typography, Switch } from 'antd';
import type { FormInstance, UploadFile } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type {
	Product,
	ProductPriceConfiguration,
	ProductPriceType,
	ProductAttribute,
	Category,
	CategoryListItem,
} from '../../../http/Catalog/types';
import { createProduct, updateProduct } from '../../../http/Catalog/products';
import { BasicInfoSection } from './sections/BasicInfo';
import { ImageUploadSection } from './sections/ImageUpload';
import { PriceConfigurationsSection } from './sections/PriceConfigurations';
import { AttributesSection } from './sections/Attributes';
import type { ProductFormValues } from './useProductFormData';
import { useNotification } from '../../../hooks/useNotification';
import { TenantSection } from './sections/TenantSection';

const { Title } = Typography;

const priceCfgToSerializable = (pc: Map<string, ProductPriceConfiguration>) => {
	const out: Record<
		string,
		{
			priceType: ProductPriceType;
			availableOptions: Record<string, number>;
		}
	> = {};
	for (const [groupKey, cfg] of pc.entries()) {
		out[groupKey] = {
			priceType: cfg.priceType,
			availableOptions: Object.fromEntries(
				cfg.availableOptions.entries()
			),
		};
	}
	return out;
};

interface Props {
	isEdit: boolean;
	form: FormInstance<ProductFormValues>;
	fileList: UploadFile[];
	setFileList: (fl: UploadFile[]) => void;
	categoryList?: CategoryListItem[];
	selectedCategory?: Category;
	selectedCategoryId?: string;
	setSelectedCategoryId: (val: string) => void;
	loadingDetail: boolean;
	loadingList: boolean;
	loadingProduct: boolean;
	productId?: string;
}

export function ProductForm({
	isEdit,
	form,
	fileList,
	setFileList,
	categoryList,
	selectedCategory,
	selectedCategoryId,
	setSelectedCategoryId,
	loadingDetail,
	loadingList,
	loadingProduct,
	productId,
}: Props) {
	const queryClient = useQueryClient();
	const notify = useNotification();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async (formData: FormData) => {
			return isEdit
				? updateProduct(productId!, formData)
				: createProduct(formData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			if (isEdit)
				queryClient.invalidateQueries({
					queryKey: ['products', 'detail', productId],
				});
			notify('success', isEdit ? 'Product updated' : 'Product created');
			navigate('/products');
		},
		onError: () => {
			notify(
				'error',
				isEdit ? 'Failed to update product' : 'Failed to create product'
			);
		},
	});

	const handleSubmit = (values: ProductFormValues) => {
		if (!selectedCategoryId || !selectedCategory) return;

		const priceConfiguration = new Map<string, ProductPriceConfiguration>();
		Object.entries(selectedCategory.priceConfiguration).forEach(
			([groupKey, cfg]) => {
				const fieldVal = values.priceConfiguration?.[groupKey];
				const availableOptionsMap = new Map<string, number>();

				if (
					fieldVal &&
					typeof fieldVal === 'object' &&
					!Array.isArray(fieldVal)
				) {
					const optionEntries: [string, number][] = Object.entries(
						fieldVal as Record<string, string | number>
					).map(([opt, val]) => [opt, Number(val)]);
					optionEntries.forEach(([optName, v]) => {
						if (Number.isFinite(v))
							availableOptionsMap.set(optName, v);
					});
				} else if (
					typeof fieldVal === 'string' ||
					typeof fieldVal === 'number'
				) {
					const v = Number(fieldVal);
					if (Number.isFinite(v))
						availableOptionsMap.set(groupKey, v);
				}

				priceConfiguration.set(groupKey, {
					priceType: cfg.priceType,
					availableOptions: availableOptionsMap,
				});
			}
		);

		const attributes: ProductAttribute[] =
			(selectedCategory.attributes ?? []).map((attr) => {
				const raw = values.attributes?.[attr.name];
				let value: string | number | boolean;
				if (attr.widgetType === 'switch') value = Boolean(raw);
				else if (attr.widgetType === 'radio')
					value = typeof raw === 'number' ? raw : String(raw ?? '');
				else value = raw as string | number | boolean;
				return { name: attr.name, value };
			}) || [];

		const payload: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = {
			name: values.name,
			description: values.description,
			tenantId: '1',
			categoryId: selectedCategoryId,
			priceConfiguration,
			attributes,
			isPublished: values.isPublished,
		};

		const serializablePayload = {
			...payload,
			priceConfiguration: priceCfgToSerializable(priceConfiguration),
		};

		const formData = new FormData();
		formData.append('data', JSON.stringify(serializablePayload));

		if (values.image && values.image.length > 0) {
			const f = values.image[0];
			if (f.originFileObj) {
				const raw = f.originFileObj as File;
				formData.append('image', raw, raw.name);
			}
		}

		mutation.mutate(formData);
	};

	if (isEdit && loadingProduct) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 24,
				}}
			>
				<Spin />
			</div>
		);
	}

	if (loadingList) return <div>Loading categories...</div>;

	return (
		<Card>
			<Title level={4}>
				{isEdit ? 'Update Product' : 'Create Product'}
			</Title>

			<Form<ProductFormValues>
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				onFinishFailed={(err) =>
					console.log('❌ Validation Failed:', err)
				}
				id="product-form"
				initialValues={{ isPublished: true }}
			>
				<BasicInfoSection
					categoryList={categoryList}
					selectedCategoryId={selectedCategoryId}
					setSelectedCategoryId={setSelectedCategoryId}
					loadingList={loadingList}
					disabledCategory={isEdit}
				/>
				{/* Tenant Section */}
				<TenantSection />

				<ImageUploadSection
					isEdit={isEdit}
					fileList={fileList}
					setFileList={setFileList}
					form={form}
				/>

				{selectedCategoryId && (
					<>
						{loadingDetail && (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									padding: 16,
								}}
							>
								<Spin size="small" />
							</div>
						)}

						{selectedCategory && (
							<>
								<PriceConfigurationsSection
									category={selectedCategory}
								/>
								<AttributesSection
									category={selectedCategory}
								/>
							</>
						)}
					</>
				)}

				<Form.Item
					label="Published"
					name="isPublished"
					valuePropName="checked"
					initialValue={!isEdit}
				>
					<Switch checkedChildren="Yes" unCheckedChildren="No" />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={mutation.isPending}
						form="product-form"
					>
						{isEdit ? 'Update Product' : 'Create Product'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
