import { Form, InputNumber, Select, Typography } from 'antd';
import type { Category } from '../../../../http/Catalog/types';

const { Title } = Typography;

interface Props {
	category?: Category;
}

export function PriceConfigurationsSection({ category }: Props) {
	if (!category) return null;

	return (
		<>
			<Title level={5}>Price Configurations</Title>
			{Object.entries(category.priceConfiguration).map(([key, cfg]) => (
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
					{cfg.availableOptions && cfg.availableOptions.length > 0 ? (
						<Select placeholder={`Select ${key} option`}>
							{cfg.availableOptions.map((opt) => (
								<Select.Option key={opt} value={opt}>
									{opt}
								</Select.Option>
							))}
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
		</>
	);
}
