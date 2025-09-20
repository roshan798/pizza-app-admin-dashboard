export type CategoryPriceType = 'base' | 'additional';
export interface CategoryPriceConfiguration {
	[key: string]: {
		priceType: CategoryPriceType;
		availableOptions: string[];
	};
}
export interface CategoryAttribute {
	_id?: string;
	name: string;
	widgetType: 'radio' | 'switch';
	defaultValue: string;
	availableOptions: string[];
}
export interface Category {
	id?: string;
	_id?: string;
	name: string;
	priceConfiguration: CategoryPriceConfiguration;
	attributes: CategoryAttribute[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface CategoryListItem {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

//product
export interface ProductResponse {
	success: boolean;
	data: Product[];
}
export type ProductPriceType = 'base' | 'additional';

export interface ProductPriceConfiguration {
	priceType: ProductPriceType;
	availableOptions: Map<string, number>;
}

export interface ProductAttribute {
	name: string;
	value: string | number | boolean;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	imageUrl?: string;
	image?: File;
	priceConfiguration: Map<string, ProductPriceConfiguration>;
	attributes: ProductAttribute[];
	tenantId: string;
	categoryId: string;
	isPublished: boolean;
	createdAt: Date;
	updatedAt: Date;
}
