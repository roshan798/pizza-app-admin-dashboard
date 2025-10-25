// pages/products/ProductList.tsx
import { useCallback, useMemo, useState } from 'react';
import {
	Table,
	Tag,
	Button,
	Space,
	Avatar,
	Input,
	Select,
	Dropdown,
	Grid,
	Card,
	Typography,
	type MenuProps,
} from 'antd';
import {
	PlusOutlined,
	MoreOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '../../http/Catalog/types';
import { Link, useNavigate } from 'react-router-dom';

// Assuming you have the same Tenant modal component used by Users

// Optional hook to resolve tenant names
import { useTenants } from '../tenants/hooks/useTenants';

// Assuming user store with role
import { useUserStore } from '../../store/userStore';
import { useTenantModal } from '../../hooks/useTenantModal';

const { Search } = Input;
const { useBreakpoint } = Grid;
const { Title } = Typography;

import { useProducts } from './hooks/useProducts';
import { Modal } from 'antd';
import { toDateTime } from '../../utils';

export default function Products() {
	const navigate = useNavigate();
	const screens = useBreakpoint();
	const { user } = useUserStore();
	const isAdmin = user?.role?.toLowerCase?.() === 'admin';

	// useProducts provides fetch + deleteMutation
	const { products, isLoading, deleteMutation } = useProducts();

	// Optional tenant name mapping
	const { tenants } = useTenants();
	const tenantMap = useMemo(() => {
		const m = new Map<string, string>();
		(tenants ?? []).forEach((t) => m.set(String(t.id), t.name));
		return m;
	}, [tenants]);

	// Tenant modal (shared hook)
	const { openTenantModal, TenantModalElement } = useTenantModal();

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<Product | null>(
		null
	);

	const handleMenuClick = useCallback(
		(action: string, id: string) => {
			switch (action) {
				case 'view': {
					navigate(`/products/${id}`);
					break;
				}
				case 'edit': {
					navigate(`/products/edit/${id}`);
					break;
				}
				case 'delete': {
					// open confirm modal
					const p = products.find(
						(x: Product) => String(x._id) === String(id)
					);
					setProductToDelete(p ?? null);
					setIsConfirmOpen(true);
					break;
				}
			}
		},
		[navigate, products]
	);

	const columns: ColumnsType<Product> = useMemo(() => {
		const cols: ColumnsType<Product> = [
			{
				title: 'Product',
				dataIndex: 'name',
				key: 'name',
				sorter: (a, b) => a.name.localeCompare(b.name),
				render: (_, record) => (
					<Space>
						<Avatar
							src={record.imageUrl}
							shape="square"
							size={screens.xs ? 'small' : 'large'}
						/>
						<Button
							type="link"
							onClick={() => navigate(`/products/${record._id}`)}
						>
							{record.name}
						</Button>
					</Space>
				),
			},
			{
				title: 'Description',
				dataIndex: 'description',
				key: 'description',
				render: (text: string) => (
					<Typography.Text
						ellipsis={{ tooltip: text }}
						style={{ maxWidth: 200 }}
					>
						{text}
					</Typography.Text>
				),
				sorter: (a, b) =>
					(a.description || '').localeCompare(b.description || ''),
			},
			{
				title: 'Category',
				dataIndex: 'categoryId',
				key: 'category',
				responsive: ['md'], // hide on small screens
				render: () => 'Pizza', // placeholder until mapping exists
				sorter: (a, b) =>
					(a.categoryId || '').localeCompare(b.categoryId || ''),
			},
			{
				title: 'Status',
				dataIndex: 'isPublished',
				key: 'status',
				render: (isPublished: boolean) =>
					isPublished ? (
						<Tag color="green">Published</Tag>
					) : (
						<Tag color="orange">Draft</Tag>
					),
				sorter: (a, b) => Number(a.isPublished) - Number(b.isPublished),
			},
			{
				title: 'Created',
				dataIndex: 'createdAt',
				key: 'createdAt',
				render: (date: string) => {
					return toDateTime(date);
				},
				sorter: (a, b) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime(),
				defaultSortOrder: 'descend',
			},
		];

		// Insert Tenant column only for admin users
		if (isAdmin) {
			cols.splice(3, 0, {
				title: 'Tenant',
				dataIndex: 'tenantId',
				key: 'tenant',
				responsive: ['sm'],
				render: (_: unknown, record) => {
					const label =
						tenantMap.get(String(record.tenantId)) ??
						String(record.tenantId ?? '-');
					return (
						<Button
							type="link"
							onClick={() =>
								openTenantModal(record.tenantId ?? '')
							}
						>
							{label}
						</Button>
					);
				},
				sorter: (a, b) =>
					String(
						tenantMap.get(String(a.tenantId)) ?? a.tenantId ?? ''
					).localeCompare(
						String(
							tenantMap.get(String(b.tenantId)) ??
								b.tenantId ??
								''
						)
					),
			});
		}

		cols.push({
			title: 'Actions',
			key: 'actions',
			render: (_, record) => {
				const items: MenuProps['items'] = [
					{ key: 'view', label: 'View', icon: <EyeOutlined /> },
					{ key: 'edit', label: 'Edit', icon: <EditOutlined /> },
					{
						key: 'delete',
						label: 'Delete',
						icon: <DeleteOutlined />,
						danger: true,
					},
				];

				const onMenuClick: MenuProps['onClick'] = ({ key }) => {
					handleMenuClick(key, String(record._id));
					// if (key === 'edit') onEdit(record);
					// if (key === 'delete') onDelete(record);
				};

				return (
					<Dropdown
						menu={{ items, onClick: onMenuClick }}
						trigger={['click']}
					>
						<Button type="text" icon={<MoreOutlined />} />
					</Dropdown>
				);
			},
		});

		return cols;
	}, [
		handleMenuClick,
		isAdmin,
		navigate,
		screens.xs,
		tenantMap,
		openTenantModal,
	]);

	return (
		<Card>
			{/* Header */}
			<Space
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 12,
					marginBottom: 16,
				}}
			>
				<Title level={4} style={{ margin: 0 }}>
					Products
				</Title>

				<Space wrap>
					<Search
						placeholder="Search products"
						style={{ width: 220 }}
					/>
					<Select placeholder="Category" style={{ width: 160 }}>
						<Select.Option value="pizza">Pizza</Select.Option>
						<Select.Option value="drinks">Drinks</Select.Option>
					</Select>
					<Select placeholder="Status" style={{ width: 160 }}>
						<Select.Option value="published">
							Published
						</Select.Option>
						<Select.Option value="draft">Draft</Select.Option>
					</Select>

					<Button type="primary" icon={<PlusOutlined />}>
						<Link to="/products/create">Create Product</Link>
					</Button>
				</Space>
			</Space>

			{/* Table */}
			<Table<Product>
				rowKey="_id"
				columns={columns}
				dataSource={products}
				loading={isLoading}
				pagination={{
					pageSize: screens.xs ? 5 : 10,
					showSizeChanger: !screens.xs,
				}}
				scroll={{ x: 'max-content' }}
			/>

			{TenantModalElement}

			<Modal
				title="Confirm Delete"
				open={isConfirmOpen}
				onOk={() => {
					if (productToDelete) {
						deleteMutation.mutate(String(productToDelete._id));
					}
					setIsConfirmOpen(false);
					setProductToDelete(null);
				}}
				confirmLoading={deleteMutation.isPending}
				onCancel={() => {
					setIsConfirmOpen(false);
					setProductToDelete(null);
				}}
				okButtonProps={{ danger: true }}
			>
				<p>
					Are you sure you want to delete{' '}
					<b>{productToDelete?.name}</b>?
				</p>
			</Modal>
		</Card>
	);
}
