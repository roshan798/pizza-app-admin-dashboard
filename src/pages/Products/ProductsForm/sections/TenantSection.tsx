import { Card, Form, Select } from 'antd';
// import { useUserStore } from '../../../../store/userStore';
import { useTenants } from '../../../tenants/hooks/useTenants';
type TenantPropsType = {
	selectedTenantId: string | undefined;
	setSelectedTenantId: (id: string) => void;
};

export function TenantSection({
	selectedTenantId,
	setSelectedTenantId,
}: TenantPropsType) {
	// const { user } = useUserStore();
	const { tenants, isLoading } = useTenants();
	// console.log('Tenants in TenantSection:', selectedTenantId, tenants);
	// const options = (tenants ?? []).map(t => ({ label: t.name, value: String(t.id) }));
	// console.log('Select value:', selectedTenantId, 'options:', options);

	return (
		<Card
			title="Tenant Information"
			style={{ marginBottom: 24 }}
			type="inner"
		>
			<Form.Item
				label="Tenant"
				name="tenantId"
				rules={[{ required: true, message: 'Select a tenant' }]}
			>
				<Select
					placeholder="Select a tenant"
					loading={isLoading}
					value={selectedTenantId ?? undefined}
					onChange={(val: string) => setSelectedTenantId(val)}
					options={(tenants ?? []).map((t) => ({
						label: t.name,
						value: String(t.id),
					}))}
					optionFilterProp="label"
				/>
			</Form.Item>
		</Card>
	);
}
