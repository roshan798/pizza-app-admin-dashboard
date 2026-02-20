import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TenantModal from '../pages/tenants/components/TenantModal';
import { getTenantById } from '../http/Auth/tenants';
import type { Tenant } from '../pages/tenants/types/types';

export function useTenantModal() {
	console.log('Initializing useTenantModal hook');
	const [tenantId, setTenantId] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	const { data: tenant, isLoading } = useQuery<Tenant | null>({
		queryKey: ['tenant', tenantId],
		queryFn: async () => {
			if (!tenantId) return null;
			const res = await getTenantById(String(tenantId));
			return res.data.tenant as Tenant;
		},
		enabled: !!tenantId && open,
	});

	const openTenantModal = (id: string | number) => {
		setTenantId(String(id));
		setOpen(true);
	};

	const closeTenantModal = () => {
		setOpen(false);
		setTenantId(null);
	};

	const TenantModalElement = (
		<TenantModal
			open={open}
			onClose={closeTenantModal}
			tenant={tenant}
			isLoading={isLoading}
		/>
	);

	return { openTenantModal, TenantModalElement, tenant } as const;
}
