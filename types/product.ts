// types/product.ts
export interface Product {
	id: number;
	name: string;
	brand: string;
	category: string;
	originalPrice: number;
	currentPrice: number; // base selling price
	lowestPrice: number; // bargain price if available
	rating: number;
	reviews: number;
	inStock: number;
	images: string[];
	description: string;
	vendor: {
		name: string;
		rating: number;
		totalSales: number;
	};

	// cart-related
	negotiatedPrice?: number; // what user agreed to pay
	quantity?: number; // default 1
	maxQuantity?: number; // from stock or API limit
}
