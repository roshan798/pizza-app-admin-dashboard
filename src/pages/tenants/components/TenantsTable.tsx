import { Table, Button, Dropdown, type MenuProps } from 'antd';
import {
	MoreOutlined,
	EditOutlined,
	DeleteOutlined,
	UserOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import type { Tenant } from '../types/types';
import { toDateTime } from '../../../utils';

interface TenantsTableProps {
	tenants: Tenant[];
	isLoading: boolean;
	onEdit: (tenant: Tenant) => void;
	onDelete: (tenant: Tenant) => void;
	onView: (tenant: Tenant) => void;
}

export default function TenantsTable({
	tenants,
	isLoading,
	onEdit,
	onDelete,
	onView,
}: TenantsTableProps) {
	const navigate = useNavigate();

	const columns: ColumnsType<Tenant> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => a.id - b.id,
			responsive: ['sm', 'md', 'lg', 'xl'],
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
			responsive: ['md', 'lg', 'xl'],
		},
		{
			title: 'Created At',
			key: 'createdAt',
			render: (_, record) => {
				return toDateTime(record.createdAt);
			},
			responsive: ['lg', 'xl'],
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => {
				const items: MenuProps['items'] = [
					{ key: 'edit', label: 'Edit', icon: <EditOutlined /> },
					{
						key: 'delete',
						label: 'Delete',
						icon: <DeleteOutlined />,
						danger: true,
					},
					{ key: 'users', label: 'Users', icon: <UserOutlined /> },
					{ key: 'view', label: 'View', icon: <EyeOutlined /> },
				];

				const onMenuClick: MenuProps['onClick'] = ({ key }) => {
					if (key === 'edit') onEdit(record);
					if (key === 'delete') onDelete(record);
					if (key === 'users')
						navigate(`/tenants/${record.id}/users`);
					if (key === 'view') onView(record);
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
		},
	];

	return (
		<Table
			rowKey="id"
			columns={columns}
			dataSource={tenants}
			loading={isLoading}
			pagination={{
				pageSizeOptions: ['5', '10', '25', '50', '100'],
				defaultPageSize: 10,
				showSizeChanger: true,
			}}
			scroll={{ x: 900 }}
		/>
	);
}
