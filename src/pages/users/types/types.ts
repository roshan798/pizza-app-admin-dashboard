export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	tenantId: number | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface Tenant {
	id: number;
	name: string;
	address: string;
	createdAt: string;
	updatedAt: string;
}
