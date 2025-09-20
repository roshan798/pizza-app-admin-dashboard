import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
	Card,
	Typography,
	Spin,
	Row,
	Col,
	Tag,
	Divider,
	Select,
	InputNumber,
	Button,
	Space,
	Checkbox,
} from 'antd';
import { useState } from 'react';
import type { Product } from '../../http/Catalog/types';
import { fetchProductById } from '../../http/Catalog/products';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProductPreviewCustomer() {
	const { id } = useParams<{ id: string }>();
	const { data: product, isLoading } = useQuery<Product>({
		queryKey: ['product', id],
		queryFn: () => fetchProductById(id!).then((res) => res.data.data),
		enabled: !!id,
	});

	const [selectedBase, setSelectedBase] = useState<string | null>(null);
	const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
	const [quantity, setQuantity] = useState(1);

	if (isLoading) return <Spin tip="Loading product..." />;
	if (!product) return <Text>Product not found ❌</Text>;

	// Split config into base vs additional
	const baseOptions = Object.entries(product.priceConfiguration || {}).filter(
		([, cfg]) => cfg.priceType === 'base'
	);
	const additionalOptions = Object.entries(
		product.priceConfiguration || {}
	).filter(([, cfg]) => cfg.priceType === 'additional');

	// Get numeric price for selected base
	const basePrice = selectedBase
		? Number(
				product.priceConfiguration[selectedBase]?.availableOptions.price
			)
		: 0;

	// Addons total
	const addonsTotal = selectedAddons.reduce((sum, addonKey) => {
		const [groupKey, optionName] = addonKey.split('-');
		const optionPrice =
			product.priceConfiguration[groupKey]?.availableOptions?.[
				optionName
			] || 0;
		return sum + Number(optionPrice);
	}, 0);

	const totalPrice = (basePrice + addonsTotal) * quantity;

	return (
		<Card
			style={{
				maxWidth: 900,
				margin: 'auto',
				borderRadius: 12,
				boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
			}}
		>
			<Row gutter={24}>
				{/* Product Image */}
				<Col xs={24} md={12}>
					{product.imageUrl && (
						<img
							src={product.imageUrl}
							alt={product.name}
							style={{
								width: '100%',
								borderRadius: 12,
								objectFit: 'cover',
								maxHeight: 500,
							}}
						/>
					)}
				</Col>

				{/* Product Info */}
				<Col xs={24} md={12}>
					<Title level={2}>{product.name}</Title>
					<Text type="secondary" style={{ fontSize: 16 }}>
						Category: {product.categoryId || 'Pizza'}
					</Text>
					<Divider />

					<Title level={4}>Description</Title>
					<Text style={{ fontSize: 16 }}>{product.description}</Text>
					<Divider />

					{/* Base Price Selection */}
					{baseOptions.length > 0 && (
						<>
							<Title level={4}>Choose Size</Title>
							<Select
								placeholder="Select size"
								style={{ width: 220, marginBottom: 16 }}
								onChange={(value) => setSelectedBase(value)}
								value={selectedBase || undefined}
							>
								{baseOptions.map(([key, cfg]) => (
									<Option key={key} value={key}>
										{key} - ₹{cfg.availableOptions.price}
									</Option>
								))}
							</Select>
						</>
					)}

					{/* Additional Options */}
					{additionalOptions.length > 0 && (
						<>
							<Title level={4}>Add-ons</Title>
							<Space direction="vertical">
								{/* Additional Options */}
								{additionalOptions.length > 0 && (
									<>
										<Space direction="vertical">
											{additionalOptions.map(
												([key, cfg]) =>
													Object.entries(
														cfg.availableOptions ||
															{}
													).map(
														([
															optionName,
															price,
														]) => {
															const addonKey = `${key}-${optionName}`; // unique key
															return (
																<Checkbox
																	key={
																		addonKey
																	}
																	checked={selectedAddons.includes(
																		addonKey
																	)}
																	onChange={(
																		e
																	) => {
																		if (
																			e
																				.target
																				.checked
																		) {
																			setSelectedAddons(
																				[
																					...selectedAddons,
																					addonKey,
																				]
																			);
																		} else {
																			setSelectedAddons(
																				selectedAddons.filter(
																					(
																						k
																					) =>
																						k !==
																						addonKey
																				)
																			);
																		}
																	}}
																>
																	{optionName}{' '}
																	- ₹{price}
																</Checkbox>
															);
														}
													)
											)}
										</Space>
										<Divider />
									</>
								)}
							</Space>
							<Divider />
						</>
					)}

					{/* Attributes */}
					{product.attributes?.length > 0 && (
						<>
							<Title level={4}>Attributes</Title>
							<Space wrap>
								{product.attributes.map((attr) => (
									<Tag color="blue" key={attr.name}>
										{attr.name}: {String(attr.value)}
									</Tag>
								))}
							</Space>
							<Divider />
						</>
					)}

					{/* Quantity + Total Price + Add to Cart */}
					<Space style={{ marginTop: 16 }}>
						<InputNumber
							min={1}
							value={quantity}
							onChange={(val) => setQuantity(val || 1)}
							style={{ width: 80 }}
						/>
						<Text strong style={{ fontSize: 18 }}>
							Total: ₹{totalPrice}
						</Text>
						<Button type="primary" disabled={!selectedBase}>
							Add to Cart
						</Button>
					</Space>

					<Divider />
					<Text>
						Status:{' '}
						{product.isPublished ? (
							<Tag color="green">Available</Tag>
						) : (
							<Tag color="orange">Coming Soon</Tag>
						)}
					</Text>
				</Col>
			</Row>
		</Card>
	);
}
