import { Form, Input, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export function PriceConfigs() {
	return (
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

							<MinusCircleOutlined onClick={() => remove(name)} />
						</Space>
					))}

					<Form.Item>
						<a onClick={() => add()} style={{ userSelect: 'none' }}>
							<PlusOutlined /> Add Price Config
						</a>
					</Form.Item>
				</>
			)}
		</Form.List>
	);
}
