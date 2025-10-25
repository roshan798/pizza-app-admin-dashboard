import { useCallback, useMemo, useState } from 'react';
import {
	Table,
	Space,
	Avatar,
	Button,
	Card,
	Typography,
	Dropdown,
	Grid,
	Modal,
} from 'antd';
import type { MenuProps } from 'antd';
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	MoreOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import type { Topping } from '../../http/Catalog/types';
import { useToppings } from './hooks/useToppings';
import { useUserStore } from '../../store/userStore';
import { useTenantModal } from '../../hooks/useTenantModal';
import { useTenants } from '../tenants/hooks/useTenants';
import { toDateTime } from '../../utils';

const { useBreakpoint } = Grid;
const { Title } = Typography;

export default function Toppings() {
	const navigate = useNavigate();
	const screens = useBreakpoint();
	const { user } = useUserStore();
	const isAdmin = user?.role?.toLowerCase?.() === 'admin';
	const { toppings = [], isLoading, deleteMutation } = useToppings();

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [toppingToDelete, setToppingToDelete] = useState<Topping | null>(
		null
	);

	const handleMenuClick = useCallback(
		(action: string, id: string) => {
			switch (action) {
				case 'view':
					navigate(`/toppings/${id}`);
					break;
				case 'edit':
					navigate(`/toppings/edit/${id}`);
					break;
				case 'delete': {
					const t = toppings.find(
						(x: Topping) => String(x.id) === String(id)
					);
					setToppingToDelete(t ?? null);
					setIsConfirmOpen(true);
					break;
				}
			}
		},
		[navigate, toppings]
	);

	const { openTenantModal, TenantModalElement } = useTenantModal();

	// tenant name mapping (cached by useTenants)
	const { tenants } = useTenants();
	const tenantMap = useMemo(() => {
		const m = new Map<string, string>();
		(tenants ?? []).forEach((t) => m.set(String(t.id), t.name));
		return m;
	}, [tenants]);

	const columns = useMemo(
		() => [
			{
				title: 'Topping',
				dataIndex: 'name',
				key: 'name',
				render: (_: unknown, record: Topping) => (
					<Space>
						<Avatar
							src={record.image}
							shape="square"
							size={screens.xs ? 'small' : 'large'}
						/>
						<Button
							type="link"
							onClick={() => navigate(`/toppings/${record.id}`)}
						>
							{record.name}
						</Button>
					</Space>
				),
			},
			{
				title: 'Price',
				dataIndex: 'price',
				key: 'price',
				render: (p: number) => `$${p}`,
			},
			...(isAdmin
				? [
						{
							title: 'Tenant',
							dataIndex: 'tenantId',
							key: 'tenant',
							render: (_: unknown, record: Topping) => (
								<Button
									type="link"
									onClick={() =>
										openTenantModal(record.tenantId ?? '')
									}
								>
									{tenantMap.get(String(record.tenantId)) ??
										String(record.tenantId ?? '-')}
								</Button>
							),
						},
					]
				: []),
			{
				title: 'Created',
				dataIndex: 'createdAt',
				key: 'createdAt',
				render: (d: string) => toDateTime(d),
			},
			{
				title: 'Actions',
				key: 'actions',
				render: (_: unknown, record: Topping) => {
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
					const onMenuClick: MenuProps['onClick'] = ({ key }) =>
						handleMenuClick(String(key), String(record.id));
					return (
						<Dropdown
							menu={{ items, onClick: onMenuClick }}
							trigger={['click']}
						>
							<Button type="text" icon={<MoreOutlined />} />
						</Dropdown>
					);
				},
			},
		],
		[
			navigate,
			screens.xs,
			isAdmin,
			handleMenuClick,
			openTenantModal,
			tenantMap,
		]
	);

	return (
		<Card>
			<Space
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<Title level={4} style={{ margin: 0 }}>
					Toppings
				</Title>
				<Button type="primary" icon={<PlusOutlined />}>
					<Link to="/toppings/create">Create Topping</Link>
				</Button>
			</Space>

			<Table
				rowKey={(r: Topping) => r.id}
				columns={columns}
				dataSource={toppings}
				loading={isLoading}
				pagination={{ pageSize: screens.xs ? 5 : 10 }}
			/>
			{TenantModalElement}

			{/* Confirm delete modal for topping */}
			<Modal
				title="Confirm Delete"
				open={isConfirmOpen}
				onOk={() => {
					if (toppingToDelete)
						deleteMutation.mutate(String(toppingToDelete.id));
					setIsConfirmOpen(false);
					setToppingToDelete(null);
				}}
				confirmLoading={deleteMutation.isPending}
				onCancel={() => {
					setIsConfirmOpen(false);
					setToppingToDelete(null);
				}}
				okButtonProps={{ danger: true }}
			>
				<p>
					Are you sure you want to delete{' '}
					<b>{toppingToDelete?.name}</b>?
				</p>
			</Modal>
		</Card>
	);
}
