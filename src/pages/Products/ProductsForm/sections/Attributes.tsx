import { Card, Form, Input, Select, Switch, Typography } from 'antd';
import type { Category } from '../../../../http/Catalog/types';

const { Title } = Typography;

interface Props {
	category?: Category;
}

export function AttributesSection({ category }: Props) {
	if (!category) return null;

	return (
		<Card title="Attributes" style={{ marginBottom: 24 }} type="inner">
			<Title level={5}>Attributes</Title>
			{category.attributes.map((attr) => (
				<Form.Item
					key={attr.name}
					label={attr.name}
					name={['attributes', attr.name]}
					valuePropName={
						attr.widgetType === 'switch' ? 'checked' : 'value'
					}
					initialValue={
						attr.widgetType === 'switch'
							? Boolean(attr.defaultValue)
							: (attr.defaultValue ?? undefined)
					}
				>
					{attr.widgetType === 'radio' ? (
						<Select placeholder={`Select ${attr.name}`}>
							{attr.availableOptions.map((opt) => (
								<Select.Option key={opt} value={opt}>
									{opt}
								</Select.Option>
							))}
						</Select>
					) : attr.widgetType === 'switch' ? (
						<Switch checkedChildren="Yes" unCheckedChildren="No" />
					) : (
						<Input placeholder="Enter value" />
					)}
				</Form.Item>
			))}
		</Card>
	);
}
