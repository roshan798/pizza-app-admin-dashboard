import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Button,
	Card,
	Form,
	Input,
	Select,
	Space,
	Typography,
	Divider,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { Category, CategoryAttribute } from '../../http/Catalog/types';
import { createCategory, updateCategory } from '../../http/Catalog/categories';

interface PriceConfigFormItem {
	key: string;
	priceType: Category['priceConfiguration'][string]['priceType'];
	availableOptions: string;
}

interface AttributeFormItem {
	name: string;
	widgetType: CategoryAttribute['widgetType'];
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

const { Title } = Typography;

export default function CreateOrUpdateCategoryForm({
	mode,
	initialCategory,
	onSuccess,
}: Props) {
	const [form] = Form.useForm();
	const queryClient = useQueryClient();
	if (mode === 'update') {
		console.log('initial category  :', initialCategory);
	}
	const mutation = useMutation({
		mutationFn: async (payload: Category) => {
			if (mode === 'create') {
				return createCategory(payload);
			}
			if (mode === 'update' && initialCategory?.id) {
				return updateCategory(initialCategory.id, payload);
			}
			throw new Error('Invalid mutation call: no category ID for update');
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			form.resetFields();
			onSuccess?.();
		},
	});

	// Transform API Category -> Form Values
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

			<Form
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
				<Form.List name="priceConfiguration">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Space
									key={key}
									align="baseline"
									style={{ display: 'flex', marginBottom: 8 }}
								>
									<Form.Item
										{...restField}
										name={[name, 'key']}
										rules={[
											{
												required: true,
												message: 'Enter option name',
											},
										]}
									>
										<Input placeholder="e.g. small, medium" />
									</Form.Item>

									<Form.Item
										{...restField}
										name={[name, 'priceType']}
										rules={[
											{
												required: true,
												message: 'Select price type',
											},
										]}
									>
										<Select
											placeholder="Price Type"
											style={{ width: 130 }}
										>
											<Select.Option value="base">
												Base
											</Select.Option>
											<Select.Option value="additional">
												Additional
											</Select.Option>
										</Select>
									</Form.Item>

									<Form.Item
										{...restField}
										name={[name, 'availableOptions']}
										rules={[
											{
												required: true,
												message: 'Enter options',
											},
										]}
									>
										<Input placeholder="Comma separated values" />
									</Form.Item>

									<MinusCircleOutlined
										onClick={() => remove(name)}
									/>
								</Space>
							))}

							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									icon={<PlusOutlined />}
								>
									Add Price Config
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				{/* Attributes */}
				<Divider>Attributes</Divider>
				<Form.List name="attributes">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Card
									size="small"
									key={key}
									style={{ marginBottom: 8 }}
									title={`Attribute ${name + 1}`}
									extra={
										<MinusCircleOutlined
											onClick={() => remove(name)}
										/>
									}
								>
									<Form.Item
										{...restField}
										name={[name, 'name']}
										rules={[
											{
												required: true,
												message: 'Enter attribute name',
											},
										]}
									>
										<Input placeholder="e.g. Size, Cheese Burst" />
									</Form.Item>

									<Form.Item
										{...restField}
										name={[name, 'widgetType']}
										rules={[
											{
												required: true,
												message: 'Select widget type',
											},
										]}
									>
										<Select placeholder="Widget Type">
											<Select.Option value="radio">
												Radio
											</Select.Option>
											<Select.Option value="switch">
												Switch
											</Select.Option>
										</Select>
									</Form.Item>

									<Form.Item
										{...restField}
										name={[name, 'defaultValue']}
										rules={[
											{
												required: true,
												message: 'Enter default value',
											},
										]}
									>
										<Input placeholder="e.g. small, false" />
									</Form.Item>

									<Form.Item
										{...restField}
										name={[name, 'availableOptions']}
										rules={[
											{
												required: true,
												message: 'Enter options',
											},
										]}
									>
										<Input placeholder="Comma separated options" />
									</Form.Item>
								</Card>
							))}

							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									icon={<PlusOutlined />}
								>
									Add Attribute
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

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
