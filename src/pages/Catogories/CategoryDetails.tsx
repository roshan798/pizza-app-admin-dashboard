import { useParams } from 'react-router-dom';
import PreviewHeader from '../../components/PreviewHeader';
import { useQuery } from '@tanstack/react-query';
import {
	Card,
	Typography,
	Spin,
	Divider,
	Row,
	Col,
	Tag,
	Space,
	Descriptions,
	Empty,
} from 'antd';
import type { Category } from '../../http/Catalog/types';
import { fetchCategoryById } from '../../http/Catalog/categories';

const { Text } = Typography;

const getCategoryById = async (id: string): Promise<Category> => {
	const res = await fetchCategoryById(id);
	return res.data.data;
};

export default function CategoryDetails() {
	const { id } = useParams<{ id: string }>();

	const {
		data: category,
		isLoading,
		isError,
	} = useQuery<Category>({
		queryKey: ['categories', id],
		queryFn: () => getCategoryById(id!),
		enabled: !!id,
	});

	if (isLoading) return <Spin size="large" />;
	if (isError) return <div>❌ Failed to load category</div>;
	if (!category) return <div>⚠️ Category not found</div>;

	const createdAt = category.createdAt
		? new Date(category.createdAt).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			})
		: '-';

	const updatedAt = category.updatedAt
		? new Date(category.updatedAt).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			})
		: '-';

	return (
		<div>
			<PreviewHeader
				title={category.name}
				editPath="/categories/edit"
				id={id}
			/>
			<Card>
				{/* Meta summary */}
				<Descriptions
					size="small"
					column={{ xs: 1, sm: 2, md: 3 }}
					colon={false}
					items={[
						{
							key: 'created',
							label: 'Created',
							children: createdAt,
						},
						{
							key: 'updated',
							label: 'Updated',
							children: updatedAt,
						},
						{
							key: 'toppingsAvailable',
							label: 'Toppings Available',
							children: category.isToppingsAvailable ? (
								<Tag color="green">Yes</Tag>
							) : (
								<Tag color="red">No</Tag>
							),
						},
						// Add status if available:
						// { key: "status", label: "Status", children: <Tag color="green">Published</Tag> },
					]}
				/>

				<Divider>Price configurations</Divider>

				{/* Price Configurations */}
				{category.priceConfiguration &&
				Object.keys(category.priceConfiguration).length > 0 ? (
					<Row gutter={[16, 16]}>
						{Object.entries(category.priceConfiguration).map(
							([key, cfg]) => (
								<Col xs={24} sm={12} md={8} key={key}>
									<Card
										size="small"
										title={key}
										variant="outlined"
									>
										<Space
											direction="vertical"
											size={8}
											style={{ width: '100%' }}
										>
											<div>
												<Text strong>Price Type: </Text>
												<Tag
													color={
														cfg.priceType === 'base'
															? 'green'
															: 'blue'
													}
												>
													{cfg.priceType}
												</Tag>
											</div>
											<div>
												<Text strong>
													Available Options:
												</Text>
												<Space
													wrap
													size={[0, 8]}
													style={{ marginTop: 8 }}
												>
													{cfg.availableOptions
														?.length ? (
														cfg.availableOptions.map(
															(opt) => (
																<Tag key={opt}>
																	{opt}
																</Tag>
															)
														)
													) : (
														<Tag color="default">
															None
														</Tag>
													)}
												</Space>
											</div>
										</Space>
									</Card>
								</Col>
							)
						)}
					</Row>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description="No price configurations"
					/>
				)}

				<Divider>Attributes</Divider>

				{/* Attributes */}
				{category.attributes?.length ? (
					<Row gutter={[16, 16]}>
						{category.attributes.map((attr, index) => (
							<Col
								xs={24}
								sm={12}
								md={8}
								key={`${attr.name}-${index}`}
							>
								<Card size="small" title={attr.name} bordered>
									<Space
										direction="vertical"
										size={8}
										style={{ width: '100%' }}
									>
										<div>
											<Text strong>Widget Type: </Text>
											<Tag color="purple">
												{attr.widgetType}
											</Tag>
										</div>
										<div>
											<Text strong>Default Value: </Text>
											{attr.defaultValue ? (
												<Tag color="cyan">
													{attr.defaultValue}
												</Tag>
											) : (
												<Text type="secondary">
													None
												</Text>
											)}
										</div>
										<div>
											<Text strong>
												Available Options:
											</Text>
											<Space
												wrap
												size={[0, 8]}
												style={{ marginTop: 8 }}
											>
												{attr.availableOptions
													?.length ? (
													attr.availableOptions.map(
														(opt) => (
															<Tag key={opt}>
																{opt}
															</Tag>
														)
													)
												) : (
													<Tag color="default">
														None
													</Tag>
												)}
											</Space>
										</div>
									</Space>
								</Card>
							</Col>
						))}
					</Row>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description="No attributes"
					/>
				)}
			</Card>
		</div>
	);
}
