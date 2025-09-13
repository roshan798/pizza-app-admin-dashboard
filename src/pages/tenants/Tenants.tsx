import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import TenantsTable from './components/TenantsTable';
import TenantModal from './components/TenantModal';
import type { Tenant } from './types/types';
import { useTenants } from './hooks/useTenants';

export default function Tenants() {
	const { tenants, isLoading, remove } = useTenants();
	const navigate = useNavigate();
	const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleEdit = (tenant: Tenant) =>
		navigate(`/tenants/edit/${tenant.id}`);
	const handleDelete = (tenant: Tenant) => {
		Modal.confirm({
			title: 'Confirm Delete',
			content: `Delete tenant ${tenant.name}?`,
			onOk: () => remove.mutate(tenant.id),
		});
	};
	const handleView = (tenant: Tenant) => {
		setSelectedTenant(tenant);
		setModalOpen(true);
	};

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: 16,
				}}
			>
				<Button
					type="primary"
					onClick={() => navigate('/tenants/create')}
				>
					New Tenant
				</Button>
			</div>

			<TenantsTable
				tenants={tenants}
				isLoading={isLoading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onView={handleView}
			/>

			<TenantModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				tenant={selectedTenant}
				isLoading={isLoading}
			/>
		</div>
	);
}
