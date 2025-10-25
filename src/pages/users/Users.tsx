import { useState } from 'react';
import { Button, Input, Select, Space, Card, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { useTenantModal } from '../../hooks/useTenantModal';
import UserTable from './components/UsersTable';
import { useUsers } from './hooks/useUsers';
import type { User } from '../../store/userStore';

export default function Users() {
	const navigate = useNavigate();
	const { users, isLoading, deleteMutation } = useUsers();

	const [roleFilter, setRoleFilter] = useState<string>();
	const [search, setSearch] = useState('');
	const { openTenantModal, TenantModalElement } = useTenantModal();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
		<Card variant="outlined">
			<Row
				justify="space-between"
				align="middle"
				gutter={[16, 16]}
				style={{ marginBottom: 16 }}
			>
				<Col>
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
				</Col>
				<Col>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => navigate('/users/create')}
					>
						Create User
					</Button>
				</Col>
			</Row>

			<UserTable
				users={filteredUsers}
				isLoading={isLoading}
				onEdit={(user) => navigate(`/users/edit/${user.id}`)}
				onDelete={(user) => {
					setUserToDelete(user);
					setIsConfirmOpen(true);
				}}
				onTenantClick={(id) => openTenantModal(id)}
			/>

			{TenantModalElement}

			<ConfirmDeleteModal
				open={isConfirmOpen}
				onConfirm={() =>
					userToDelete &&
					deleteMutation.mutate(Number(userToDelete.id))
				}
				onCancel={() => {
					setIsConfirmOpen(false);
					setUserToDelete(null);
				}}
				isLoading={deleteMutation.isPending}
				user={userToDelete}
			/>
		</Card>
	);
}
