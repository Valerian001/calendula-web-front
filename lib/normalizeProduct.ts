// lib/normalizeProduct.ts
import { Product } from "@/types/product";

const mockProduct: Product = {
	id: 1,
	name: "Wireless Bluetooth Headphones",
	brand: "AudioTech Pro",
	category: "Electronics",
	originalPrice: 129.99,
	currentPrice: 89.99,
	lowestPrice: 75.0,
	rating: 4.5,
	reviews: 234,
	inStock: 15,
	images: [
		"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center",
		"https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center",
	],
	description:
		"Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and crystal-clear audio reproduction.",
	vendor: {
		name: "TechGear Store",
		rating: 4.8,
		totalSales: 1250,
	},
};

export function normalizeProduct(apiProduct: any): Product {
	if (!apiProduct) throw new Error("Invalid product payload");

	return {
		id: apiProduct.id,
		name: apiProduct.name,
		brand: apiProduct.brand ?? "Unknown",
		category: apiProduct.category ?? "General",
		originalPrice: Number(apiProduct.originalPrice) || 0,
		currentPrice: Number(apiProduct.price) || 0,
		lowestPrice: Number(apiProduct.bargain_price) || 0,
		rating: Number(apiProduct.rating) || 0,
		reviews: Number(apiProduct.reviews) || 0,
		inStock: Number(apiProduct.inStock) || 0,
		images: apiProduct.image ? [apiProduct.image] : [],
		description: apiProduct.shipdt ?? "No description",
		vendor: {
			name: apiProduct.vendor?.name ?? "Unknown Vendor",
			rating: apiProduct.vendor?.rating ?? 0,
			totalSales: apiProduct.vendor?.totalSales ?? 0,
		},

		// cart defaults
		negotiatedPrice:
			Number(apiProduct.negotiatedPrice) || Number(apiProduct.price) || 0,
		quantity: apiProduct.quantity ?? 1,
		maxQuantity:
			apiProduct.maxQuantity ?? Math.max(1, Number(apiProduct.inStock) || 1),
	};
}
