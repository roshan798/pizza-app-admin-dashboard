import { useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TenantModal from './components/TenantModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { getTenantById } from '../../http/tenants';
import { useQuery } from '@tanstack/react-query';
import type { Tenant, User } from './types/types';
import UserTable from './components/UsersTable';
import { useUsers } from './hooks/useUsers';

export default function Users() {
	const navigate = useNavigate();
	const { users, isLoading, deleteMutation } = useUsers();

	const [roleFilter, setRoleFilter] = useState<string>();
	const [search, setSearch] = useState('');

	const [tenantId, setTenantId] = useState<number | null>(null);
	const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	const { data: tenant, isFetching: isTenantLoading } = useQuery({
		queryKey: ['tenant', tenantId],
		queryFn: () =>
			tenantId
				? getTenantById(String(tenantId)).then(
						(res) => res.data.tenant as Tenant
					)
				: null,
		enabled: !!tenantId && isTenantModalOpen,
	});

	const filteredUsers =
		users
			?.filter((u) =>
				roleFilter
					? u.role.toLowerCase() === roleFilter.toLowerCase()
					: true
			)
			.filter((u) =>
				search
					? `${u.firstName} ${u.lastName}`
							.toLowerCase()
							.includes(search.toLowerCase()) ||
						u.email.toLowerCase().includes(search.toLowerCase())
					: true
			) || [];

	return (
		<div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
			{/* Filters */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<Space>
					<Input.Search
						placeholder="Search users"
						allowClear
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 200 }}
					/>
					<Select
						placeholder="Filter by Role"
						allowClear
						onChange={(val) => setRoleFilter(val)}
						style={{ width: 150 }}
						options={[
							{ label: 'Admin', value: 'admin' },
							{ label: 'Customer', value: 'customer' },
							{ label: 'Manager', value: 'manager' },
						]}
					/>
				</Space>

				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => navigate('/users/create')}
				>
					Create User
				</Button>
			</div>

			{/* Table */}
			<UserTable
				users={filteredUsers}
				isLoading={isLoading}
				onEdit={(user) => navigate(`/users/edit/${user.id}`)}
				onDelete={(user) => {
					setUserToDelete(user);
					setIsConfirmOpen(true);
				}}
				onTenantClick={(id) => {
					setTenantId(id);
					setIsTenantModalOpen(true);
				}}
			/>

			{/* Tenant Modal */}
			<TenantModal
				open={isTenantModalOpen}
				onClose={() => {
					setIsTenantModalOpen(false);
					setTenantId(null);
				}}
				tenant={tenant}
				isLoading={isTenantLoading}
			/>

			{/* Confirm Delete Modal */}
			<ConfirmDeleteModal
				open={isConfirmOpen}
				onConfirm={() =>
					userToDelete && deleteMutation.mutate(userToDelete.id)
				}
				onCancel={() => {
					setIsConfirmOpen(false);
					setUserToDelete(null);
				}}
				isLoading={deleteMutation.isPending}
				user={userToDelete}
			/>
		</div>
	);
}
