import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Form,
	Input,
	Button,
	Card,
	Typography,
	Select,
	InputNumber,
	Switch,
	Upload,
	type UploadFile,
	Spin,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
	fetchCategoriesList,
	fetchCategoryById,
} from '../../http/Catalog/categories';
import type {
	Category,
	CategoryListItem,
	Product,
	ProductAttribute,
	ProductPriceConfiguration,
	ProductPriceType,
} from '../../http/Catalog/types';
import {
	createProduct,
	fetchProductById,
	updateProduct,
} from '../../http/Catalog/products';
import { useEffect, useState } from 'react';
import { useNotification } from '../../hooks/useNotification';

const { Title } = Typography;

interface ProductFormValues {
	name: string;
	description: string;
	categoryId: string;
	image?: UploadFile[];
	priceConfiguration?: Record<
		string,
		Record<string, string | number> | string | number
	>;
	attributes?: Record<string, string | number | boolean>;
	isPublished: boolean;
}

const logFormData = (formData: FormData) => {
	for (const [key, value] of formData.entries()) {
		console.log(key, value);
	}
};

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

export default function CreateOrUpdateProductForm() {
	const { id } = useParams<{ id?: string }>(); // edit mode if id exists
	const isEdit = Boolean(id);
	const notify = useNotification();
	const navigate = useNavigate();
	const [form] = Form.useForm<ProductFormValues>();
	const queryClient = useQueryClient();

	const [selectedCategoryId, setSelectedCategoryId] = useState<
		string | undefined
	>(undefined);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	console.log('File ist : ', fileList);
	// 0) If editing, fetch current product
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

	// 1) Fetch CategoryListItem[] for picker
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

	// 2) Fetch full Category for dynamic fields when category is selected
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

	// When existing product arrives, prefill form and set selectedCategoryId
	useEffect(() => {
		if (existingProduct) {
			form.setFieldsValue({
				name: existingProduct.name,
				description: existingProduct.description,
				categoryId: existingProduct.categoryId,
				isPublished: existingProduct.isPublished,
				// priceConfiguration and attributes are dynamic and will be user-entered again,
				// unless you want to pre-map them. For simplicity, leave them unset here.
			});
			setSelectedCategoryId(existingProduct.categoryId);
		} else if (!isEdit) {
			form.resetFields();
			form.setFieldsValue({ isPublished: true });
			setSelectedCategoryId(undefined);
		}
	}, [existingProduct, isEdit, form]);
	useEffect(() => {
		if (isEdit && existingProduct?.imageUrl) {
			// Prefill Upload with existing image for preview (status 'done' to show as uploaded)
			setFileList([
				{
					uid: '-1',
					name: 'current-image',
					status: 'done',
					url: existingProduct.imageUrl,
				},
			]);
		}
	}, [isEdit, existingProduct]);
	// Reset dependent fields whenever category changes manually
	useEffect(() => {
		form.setFieldsValue({
			priceConfiguration: undefined,
			attributes: undefined,
		});
	}, [selectedCategoryId, form]);

	// CREATE or UPDATE mutation
	const mutation = useMutation({
		mutationFn: async (formData: FormData) => {
			return isEdit
				? updateProduct(id!, formData)
				: createProduct(formData);
		},
		onSuccess: (res) => {
			// Invalidate lists and specific detail
			console.log('response from update product', res.data);
			queryClient.invalidateQueries({ queryKey: ['products'] });
			if (isEdit)
				queryClient.invalidateQueries({
					queryKey: ['products', 'detail', id],
				});
			notify('success', isEdit ? 'Product updated' : 'Product created');
			navigate('/products');
		},
		onError: (err: unknown) => {
			console.error(err);
			notify(
				'error',
				isEdit ? 'Failed to update product' : 'Failed to create product'
			);
		},
	});

	const handleSubmit = (values: ProductFormValues) => {
		if (!selectedCategoryId || !selectedCategory) return;
		console.log(values);
		// Build priceConfiguration Map
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
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					optionEntries.forEach(([k, v]) => {
						if (Number.isFinite(v))
							availableOptionsMap.set(groupKey, v);
					});
				} else if (
					typeof fieldVal === 'string' ||
					typeof fieldVal === 'number'
				) {
					// const keyForSingle = typeof fieldVal === "string" ? fieldVal : "base";
					const numVal = Number(fieldVal);
					if (Number.isFinite(numVal))
						availableOptionsMap.set(groupKey, numVal);
				}

				priceConfiguration.set(groupKey, {
					priceType: cfg.priceType,
					availableOptions: availableOptionsMap,
				});
			}
		);

		// Build attributes
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

		// Domain model
		const payload: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = {
			name: values.name,
			description: values.description,
			tenantId: '1',
			categoryId: selectedCategoryId,
			priceConfiguration,
			attributes,
			isPublished: values.isPublished,
		};

		// Serialize Maps
		const serializablePayload = {
			...payload,
			priceConfiguration: priceCfgToSerializable(priceConfiguration),
		};

		// FormData
		const formData = new FormData();

		formData.append('data', JSON.stringify(serializablePayload));
		// In handleSubmit before mutation.mutate(formData):
		if (values.image && values.image.length > 0) {
			const f = values.image[0];
			// Only send if a new file was picked (originFileObj exists)
			if (f.originFileObj) {
				const rawFile = f.originFileObj as File;
				formData.append('image', rawFile, rawFile.name);
			}
		}

		logFormData(formData);
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
				<Form.Item
					label="Product Name"
					name="name"
					rules={[{ required: true, message: 'Enter product name' }]}
				>
					<Input placeholder="e.g. Pizza Deluxe" />
				</Form.Item>

				<Form.Item
					label="Category"
					name="categoryId"
					rules={[{ required: true, message: 'Select a category' }]}
				>
					<Select
						placeholder="Select a category"
						onChange={(val: string) => setSelectedCategoryId(val)}
						loading={loadingList}
						value={selectedCategoryId}
						disabled={isEdit && Boolean(existingProduct)} // disable if editing to avoid schema mismatch; enable if changing category is allowed
					>
						{(categoryList ?? []).map((cat) => (
							<Select.Option
								key={cat.id ?? cat.name}
								value={cat.id!}
							>
								{cat.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label="Description"
					name="description"
					rules={[{ required: true, message: 'Enter description' }]}
				>
					<Input.TextArea
						rows={3}
						placeholder="Enter product description"
					/>
				</Form.Item>

				<Form.Item
					label="Product Image"
					name="image"
					valuePropName="fileList"
					getValueFromEvent={(e) => e?.fileList}
					rules={
						isEdit
							? [] // optional on update
							: [
									{
										required: true,
										message: 'Please upload an image',
									},
								]
					}
				>
					<Upload
						listType="picture-card"
						fileList={fileList}
						beforeUpload={() => false} // prevent auto upload
						maxCount={1} // allow only 1 image
						onChange={({ fileList }) => setFileList(fileList)}
					>
						{fileList.length >= 1 ? null : (
							<Button icon={<UploadOutlined />}>Upload</Button>
						)}
					</Upload>
				</Form.Item>

				{/* Dynamic fields from category detail */}
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
								<Title level={5}>Price Configurations</Title>
								{Object.entries(
									selectedCategory.priceConfiguration
								).map(([key, cfg]) => (
									<Form.Item
										key={key}
										label={key}
										name={['priceConfiguration', key]}
										tooltip={
											cfg.priceType === 'base'
												? 'Base price or option pricing for this group'
												: 'Additional price added on top'
										}
									>
										{cfg.availableOptions &&
										cfg.availableOptions.length > 0 ? (
											<Select
												placeholder={`Select ${key} option`}
											>
												{cfg.availableOptions.map(
													(opt) => (
														<Select.Option
															key={opt}
															value={opt}
														>
															{opt}
														</Select.Option>
													)
												)}
											</Select>
										) : (
											<InputNumber
												min={0}
												style={{ width: '100%' }}
												placeholder={`Enter ${cfg.priceType} price`}
											/>
										)}
									</Form.Item>
								))}

								<Title level={5}>Attributes</Title>
								{selectedCategory.attributes.map((attr) => (
									<Form.Item
										key={attr.name}
										label={attr.name}
										name={['attributes', attr.name]}
										valuePropName={
											attr.widgetType === 'switch'
												? 'checked'
												: 'value'
										}
										initialValue={
											attr.widgetType === 'switch'
												? Boolean(attr.defaultValue)
												: (attr.defaultValue ??
													undefined)
										}
									>
										{attr.widgetType === 'radio' ? (
											<Select
												placeholder={`Select ${attr.name}`}
											>
												{attr.availableOptions.map(
													(opt) => (
														<Select.Option
															key={opt}
															value={opt}
														>
															{opt}
														</Select.Option>
													)
												)}
											</Select>
										) : attr.widgetType === 'switch' ? (
											<Switch
												checkedChildren="Yes"
												unCheckedChildren="No"
											/>
										) : (
											<Input placeholder="Enter value" />
										)}
									</Form.Item>
								))}
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
						Create Product
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
