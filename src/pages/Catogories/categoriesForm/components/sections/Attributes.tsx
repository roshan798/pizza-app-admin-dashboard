import { Card, Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export function Attributes() {
	return (
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
						<a onClick={() => add()} style={{ userSelect: 'none' }}>
							<PlusOutlined /> Add Attribute
						</a>
					</Form.Item>
				</>
			)}
		</Form.List>
	);
}
