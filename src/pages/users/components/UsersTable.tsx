import { Table, Tag, Button, Space, Avatar, Dropdown } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import type { User } from '../types/types';

interface UserTableProps {
	users: User[];
	isLoading: boolean;
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
	onTenantClick: (tenantId: number) => void;
}

export default function UserTable({
	users,
	isLoading,
	onEdit,
	onDelete,
	onTenantClick,
}: UserTableProps) {
	const columns: ColumnsType<User> = [
		{
			title: 'User name',
			key: 'name',
			sorter: (a, b) =>
				`${a.firstName} ${a.lastName}`.localeCompare(
					`${b.firstName} ${b.lastName}`
				),
			render: (_, record) => (
				<Space>
					<Avatar>{record.firstName[0]}</Avatar>
					{record.firstName} {record.lastName}
				</Space>
			),
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			sorter: (a, b) => a.role.localeCompare(b.role),
			render: (role: string) => {
				let color = 'blue';
				switch (role.toLowerCase()) {
					case 'admin':
						color = 'green';
						break;
					case 'customer':
						color = 'volcano';
						break;
					case 'manager':
						color = 'geekblue';
						break;
				}
				return <Tag color={color}>{role}</Tag>;
			},
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => a.email.localeCompare(b.email),
		},
		{
			title: 'Tenant',
			dataIndex: 'tenantId',
			key: 'tenantId',
			sorter: (a, b) => (a.tenantId || 0) - (b.tenantId || 0),
			render: (tenantId: number | null) =>
				tenantId ? (
					<Button type="link" onClick={() => onTenantClick(tenantId)}>
						{tenantId}
					</Button>
				) : (
					<Tag>No Tenant</Tag>
				),
		},
		{
			title: 'Created At',
			key: 'createdAt',
			sorter: (a, b) =>
				new Date(a.createdAt).getTime() -
				new Date(b.createdAt).getTime(),
			render: (_, record) =>
				new Date(record.createdAt).toLocaleString('en-IN', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				}),
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
				];

				const onMenuClick: MenuProps['onClick'] = ({ key }) => {
					if (key === 'edit') onEdit(record);
					if (key === 'delete') onDelete(record);
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
			dataSource={users}
			loading={isLoading}
			pagination={{
				pageSizeOptions: ['5', '10', '25', '50', '100'],
				defaultPageSize: 5,
				showSizeChanger: true,
			}}
		/>
	);
}
