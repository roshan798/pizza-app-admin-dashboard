import { Modal, Spin } from 'antd';
import type { Tenant } from '../types/types';

interface TenantModalProps {
	open: boolean;
	onClose: () => void;
	tenant: Tenant | null | undefined;
	isLoading: boolean;
}

export default function TenantModal({
	open,
	onClose,
	tenant,
	isLoading,
}: TenantModalProps) {
	return (
		<Modal
			title="Tenant Details"
			open={open}
			onCancel={onClose}
			footer={null}
		>
			{isLoading ? (
				<Spin />
			) : tenant ? (
				<div>
					<p>
						<b>ID:</b> {tenant.id}
					</p>
					<p>
						<b>Name:</b> {tenant.name}
					</p>
					<p>
						<b>Address:</b> {tenant.address}
					</p>
					<p>
						<b>Created At:</b>{' '}
						{new Date(tenant.createdAt).toLocaleString()}
					</p>
					<p>
						<b>Updated At:</b>{' '}
						{new Date(tenant.updatedAt).toLocaleString()}
					</p>
				</div>
			) : (
				<p>No tenant data found</p>
			)}
		</Modal>
	);
}
