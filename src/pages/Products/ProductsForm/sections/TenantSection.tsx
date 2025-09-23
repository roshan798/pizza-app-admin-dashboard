import { Card, Form, Input } from 'antd';
import { useUserStore } from '../../../../store/userStore';
// import type { Tenant } from "../../../users/CreateOrUpdateUser";
// type TenantPropsType = {
//     tenantId?: string;
//     tenants: Tenant[];
//     setTenantId: (id: string) => void;
//     loadingTenants: boolean;
//     disabledTenant: boolean;
// }

export function TenantSection() {
	const { user } = useUserStore();
	console.log('User in TenantSection:', user);
	return (
		<Card
			title="Tenant Information"
			style={{ marginBottom: 24 }}
			type="inner"
		>
			{/* <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: 'Select a category' }]}
            >
                <Select
                    placeholder="Select a category"
                    onChange={(val: string) => setSelectedCategoryId(val)}
                    loading={loadingList}
                    value={selectedCategoryId}
                    disabled={disabledCategory}
                >
                    {(categoryList ?? []).map((cat) => (
                        <Select.Option key={cat.id ?? cat.name} value={cat.id!}>
                            {cat.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item> */}

			<Form.Item
				label="Tenant"
				name="TenantId"
				// rules={[{ required: true, message: 'Enter description' }]}
			>
				<Input
					// rows={3}
					value={user?.tenantId ? user.tenantId : 'No Tenant'}
				/>
			</Form.Item>
		</Card>
	);
}
