import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
	Layout,
	Card,
	Typography,
	Spin,
	Tag,
	Divider,
	Select,
	InputNumber,
	Button,
	Space,
	Checkbox,
	Empty,
	Affix,
	Row,
	Col,
	Badge,
} from 'antd';
import { useMemo, useState } from 'react';
import type { Product } from '../../http/Catalog/types';
import { fetchProductById } from '../../http/Catalog/products';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type PriceType = 'base' | 'additional';
const inr = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 2,
});
type GroupCfg = {
	priceType: PriceType;
	availableOptions: Record<string, number> | { price?: number } | undefined;
};
type PriceConfig = Record<string, GroupCfg>;
const isRecord = (v: unknown): v is Record<string, unknown> =>
	!!v && typeof v === 'object' && !Array.isArray(v);
const toNumber = (n: unknown) => (Number.isFinite(Number(n)) ? Number(n) : 0);

export default function ProductDetailStacked() {
	// 1) All hooks at top
	const { id } = useParams<{ id: string }>();
	const { data: product, isLoading } = useQuery<Product>({
		queryKey: ['product', id],
		queryFn: () => fetchProductById(id!).then((res) => res.data.data),
		enabled: !!id,
	});

	const [selectedBaseKey, setSelectedBaseKey] = useState<
		string | undefined
	>();
	const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
	const [quantity, setQuantity] = useState<number>(1);

	// 2) All derived memos unconditionally
	const priceConfiguration: PriceConfig = useMemo(
		() => (product?.priceConfiguration as unknown as PriceConfig) ?? {},
		[product?.priceConfiguration]
	);

	const entries = useMemo(
		() => Object.entries(priceConfiguration),
		[priceConfiguration]
	);

	const baseGroups = useMemo(
		() => entries.filter(([, cfg]) => cfg.priceType === 'base'),
		[entries]
	);
	const addOnGroups = useMemo(
		() => entries.filter(([, cfg]) => cfg.priceType === 'additional'),
		[entries]
	);

	const baseChoices = useMemo(() => {
		const list: Array<{ value: string; label: string; amount: number }> =
			[];
		baseGroups.forEach(([groupKey, cfg]) => {
			const opts = cfg.availableOptions;
			if (isRecord(opts) && 'price' in opts) {
				const amount = toNumber((opts as { price?: number }).price);
				list.push({
					value: groupKey,
					label: `${groupKey} - ${inr.format(amount)}`,
					amount,
				});
			} else if (isRecord(opts)) {
				Object.entries(opts as Record<string, number>).forEach(
					([optName, amount]) => {
						const v = toNumber(amount);
						list.push({
							value: `${groupKey}:${optName}`,
							label: `${optName} - ${inr.format(v)}`,
							amount: v,
						});
					}
				);
			}
		});
		return list;
	}, [baseGroups]);

	const basePrice = useMemo(() => {
		if (!selectedBaseKey) return 0;
		if (selectedBaseKey.includes(':')) {
			const [groupKey, optName] = selectedBaseKey.split(':');
			const cfg = priceConfiguration[groupKey];
			const opts = cfg?.availableOptions;
			if (isRecord(opts) && !(('price' in opts) as boolean)) {
				return toNumber((opts as Record<string, number>)[optName]);
			}
			return 0;
		}
		const cfg = priceConfiguration[selectedBaseKey];
		const opts = cfg?.availableOptions;
		return isRecord(opts) && 'price' in opts
			? toNumber((opts as { price?: number }).price)
			: 0;
	}, [selectedBaseKey, priceConfiguration]);

	const addonItems = useMemo(() => {
		const items: Array<{ key: string; label: string; amount: number }> = [];
		addOnGroups.forEach(([groupKey, cfg]) => {
			const opts = cfg.availableOptions;
			if (isRecord(opts)) {
				Object.entries(opts as Record<string, number>).forEach(
					([optName, amount]) => {
						const v = toNumber(amount);
						items.push({
							key: `${groupKey}|${optName}`,
							label: `${optName} (${inr.format(v)})`,
							amount: v,
						});
					}
				);
			}
		});
		return items;
	}, [addOnGroups]);

	const addonsTotal = useMemo(
		() =>
			selectedAddons.reduce(
				(sum, key) =>
					sum + (addonItems.find((i) => i.key === key)?.amount ?? 0),
				0
			),
		[selectedAddons, addonItems]
	);

	const totalPrice = useMemo(
		() => (basePrice + addonsTotal) * quantity,
		[basePrice, addonsTotal, quantity]
	);

	// 3) Early returns
	if (isLoading) return <Spin tip="Loading product..." />;
	if (!product) return <Text>Product not found ❌</Text>;

	// Shared styles to prevent vertical letter wrapping
	const longTextStyle: React.CSSProperties = {
		wordBreak: 'break-word',
		whiteSpace: 'pre-wrap',
	};

	const chipStyle: React.CSSProperties = {
		display: 'inline-block',
		padding: '2px 8px',
		borderRadius: 12,
		background: 'rgba(24,144,255,0.1)',
		color: '#1890ff',
		fontSize: 12,
		maxWidth: 'max-content',
		wordBreak: 'break-word',
		whiteSpace: 'normal',
	};

	return (
		<Layout style={{ background: 'transparent' }}>
			<Content style={{ padding: 16 }}>
				<Row gutter={[24, 24]}>
					{/* Gallery */}
					<Col xs={24} md={13}>
						<Card
							style={{ borderRadius: 12 }}
							bodyStyle={{
								padding: 16,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{product.imageUrl ? (
								<img
									src={product.imageUrl}
									alt={product.name}
									style={{
										width: '100%',
										borderRadius: 12,
										objectFit: 'cover',
										maxHeight: 520,
									}}
								/>
							) : (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description="No image"
								/>
							)}
						</Card>

						<Card
							style={{ marginTop: 16, borderRadius: 12 }}
							bodyStyle={{ padding: 16 }}
						>
							<Title
								level={3}
								style={{ marginBottom: 8, ...longTextStyle }}
							>
								{product.name}
							</Title>
							<Text type="secondary" style={longTextStyle}>
								Category: {product.categoryId || 'Pizza'}
							</Text>

							<Divider />

							<Title level={4} style={{ marginTop: 0 }}>
								Description
							</Title>
							<Text
								style={{
									fontSize: 16,
									lineHeight: 1.6,
									...longTextStyle,
								}}
							>
								{product.description}
							</Text>

							<Card
								style={{ marginTop: 16, borderRadius: 12 }}
								bodyStyle={{ padding: 16 }}
							>
								<Title level={4} style={{ marginTop: 0 }}>
									Product details
								</Title>

								{product.attributes?.length ? (
									<Row gutter={[12, 12]}>
										{product.attributes.map((attr) => {
											const val = attr.value;
											return (
												<Col
													xs={24}
													sm={12}
													lg={8}
													key={attr.name}
												>
													<div
														style={{
															display: 'flex',
															flexDirection:
																'column',
															gap: 6,
															minWidth: 0, // allow children to shrink/wrap
														}}
													>
														<Text
															type="secondary"
															style={{
																fontWeight: 500,
																margin: 0,
															}}
														>
															{attr.name}
														</Text>

														{typeof val ===
														'boolean' ? (
															<Badge
																status={
																	val
																		? 'success'
																		: 'default'
																}
																text={
																	val
																		? 'Yes'
																		: 'No'
																}
															/>
														) : (
															<span
																style={
																	chipStyle
																}
															>
																{String(val)}
															</span>
														)}
													</div>
												</Col>
											);
										})}
									</Row>
								) : (
									<Empty
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description="No attributes"
									/>
								)}
							</Card>

							<Divider />
							<Text>
								Status:{' '}
								{product.isPublished ? (
									<Tag color="green">Available</Tag>
								) : (
									<Tag color="orange">Coming Soon</Tag>
								)}
							</Text>
						</Card>
					</Col>

					{/* Configurator */}
					<Col xs={24} md={11}>
						<Affix offsetTop={100}>
							<Card
								style={{ borderRadius: 12 }}
								bodyStyle={{ padding: 16 }}
							>
								<Space
									direction="vertical"
									style={{ width: '100%' }}
									size="large"
								>
									{/* Base */}
									{baseChoices.length > 0 && (
										<div>
											<Title
												level={4}
												style={{ marginTop: 0 }}
											>
												Choose Base
											</Title>
											<Select
												placeholder="Select base"
												style={{ width: '100%' }}
												onChange={(value: string) =>
													setSelectedBaseKey(value)
												}
												value={selectedBaseKey}
												allowClear
											>
												{baseChoices.map((c) => (
													<Option
														key={c.value}
														value={c.value}
													>
														{c.label}
													</Option>
												))}
											</Select>
											<Text type="secondary">
												Base price:{' '}
												{inr.format(basePrice)}
											</Text>
										</div>
									)}

									{/* Add-ons */}
									<div>
										<Title
											level={4}
											style={{ marginTop: 0 }}
										>
											Add-ons
										</Title>
										{addonItems.length ? (
											<Space
												direction="vertical"
												style={{ width: '100%' }}
											>
												{addonItems.map((item) => (
													<Checkbox
														key={item.key}
														checked={selectedAddons.includes(
															item.key
														)}
														onChange={(e) => {
															const checked =
																e.target
																	.checked;
															setSelectedAddons(
																(prev) =>
																	checked
																		? [
																				...prev,
																				item.key,
																			]
																		: prev.filter(
																				(
																					k
																				) =>
																					k !==
																					item.key
																			)
															);
														}}
													>
														{item.label}
													</Checkbox>
												))}
											</Space>
										) : (
											<Text type="secondary">
												No add-ons available
											</Text>
										)}
									</div>

									{/* Order block */}
									<Card size="small">
										<Space size="large" align="center" wrap>
											<Space align="center">
												<Text>Qty</Text>
												<InputNumber
													min={1}
													value={quantity}
													onChange={(val) =>
														setQuantity(
															(val as number) || 1
														)
													}
													style={{ width: 90 }}
												/>
											</Space>
											<Text
												strong
												style={{ fontSize: 18 }}
											>
												Total: {inr.format(totalPrice)}
											</Text>
											<Button
												type="primary"
												size="large"
												disabled={
													baseChoices.length > 0 &&
													!selectedBaseKey
												}
											>
												Add to Cart
											</Button>
										</Space>
									</Card>
								</Space>
							</Card>
						</Affix>
					</Col>
				</Row>
			</Content>
		</Layout>
	);
}
