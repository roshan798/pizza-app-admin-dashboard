import { Card, Form, Input, Select } from 'antd';
import type { CategoryListItem } from '../../../../http/Catalog/types';

interface Props {
	categoryList?: CategoryListItem[];
	selectedCategoryId?: string;
	setSelectedCategoryId: (id: string) => void;
	loadingList: boolean;
	disabledCategory: boolean;
}

export function BasicInfoSection({
	categoryList,
	selectedCategoryId,
	setSelectedCategoryId,
	loadingList,
	disabledCategory,
}: Props) {
	return (
		<Card
			title="Basic Information"
			style={{ marginBottom: 24 }}
			type="inner"
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
					disabled={disabledCategory}
				>
					{(categoryList ?? []).map((cat) => (
						<Select.Option key={cat.id ?? cat.name} value={cat.id!}>
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
		</Card>
	);
}
