// store/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalizeProduct } from "@/lib/normalizeProduct";

// --- Types ---
export interface CartItem {
	id: number;
	name: string;
	brand: string;
	image: string;
	originalPrice: number;
	negotiatedPrice: number;
	quantity: number;
	maxQuantity: number;
	inStock: number;
	vendor: string;
}

interface CartState {
	cartItems: CartItem[];
	removedItems: CartItem[];
	selectedItems: number[];
}

const initialState: CartState = {
	cartItems: [],
	removedItems: [],
	selectedItems: [],
};

// --- Slice ---
const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		// ✅ Add or increment a product (normalized)
		addToCart: (state, action: PayloadAction<any>) => {
			const normalized = normalizeProduct(action.payload);

			const product: CartItem = {
				id: normalized.id,
				name: normalized.name,
				brand: normalized.brand,
				image: normalized.images[0] ?? "",
				originalPrice: normalized.originalPrice,
				negotiatedPrice: normalized.negotiatedPrice ?? normalized.currentPrice,
				quantity: normalized.quantity ?? 1,
				maxQuantity: normalized.maxQuantity ?? normalized.inStock,
				inStock: normalized.inStock,
				vendor: normalized.vendor?.name ?? "Unknown Vendor",
			};

			const existing = state.cartItems.find((i) => i.id === product.id);

			if (existing) {
				existing.quantity = Math.min(
					existing.quantity + product.quantity,
					existing.maxQuantity
				);
			} else {
				state.cartItems.push(product);
			}
		},

		setCartItems: (state, action: PayloadAction<any[]>) => {
			const normalizedItems: CartItem[] = action.payload.map((raw) => {
				const normalized = normalizeProduct(raw);
				return {
					id: normalized.id,
					name: normalized.name,
					brand: normalized.brand,
					image: normalized.images[0] ?? "",
					originalPrice: normalized.originalPrice,
					negotiatedPrice:
						normalized.negotiatedPrice ?? normalized.currentPrice,
					quantity: normalized.quantity ?? 1,
					maxQuantity: normalized.maxQuantity ?? normalized.inStock,
					inStock: normalized.inStock,
					vendor: normalized.vendor?.name ?? "Unknown Vendor",
				};
			});

			state.cartItems = normalizedItems;
			state.selectedItems = normalizedItems.map((item) => item.id);
		},

		updateQuantity: (
			state,
			action: PayloadAction<{ id: number; quantity: number }>
		) => {
			const item = state.cartItems.find((i) => i.id === action.payload.id);
			if (item) {
				item.quantity = Math.min(action.payload.quantity, item.maxQuantity);
			}
		},

		removeItem: (state, action: PayloadAction<number>) => {
			const idx = state.cartItems.findIndex((i) => i.id === action.payload);
			if (idx !== -1) {
				const [removed] = state.cartItems.splice(idx, 1);
				state.removedItems.push(removed);
				state.selectedItems = state.selectedItems.filter(
					(id) => id !== removed.id
				);
			}
		},

		restoreItem: (state, action: PayloadAction<CartItem>) => {
			state.cartItems.push(action.payload);
		},

		toggleItemSelection: (state, action: PayloadAction<number>) => {
			if (state.selectedItems.includes(action.payload)) {
				state.selectedItems = state.selectedItems.filter(
					(id) => id !== action.payload
				);
			} else {
				state.selectedItems.push(action.payload);
			}
		},

		selectAll: (state) => {
			state.selectedItems = state.cartItems.map((item) => item.id);
		},

		deselectAll: (state) => {
			state.selectedItems = [];
		},

		clearRemovedItem: (state, action: PayloadAction<number>) => {
			state.removedItems = state.removedItems.filter(
				(item) => item.id !== action.payload
			);
		},
	},
});

export const {
	addToCart,
	setCartItems,
	updateQuantity,
	removeItem,
	restoreItem,
	toggleItemSelection,
	selectAll,
	deselectAll,
	clearRemovedItem,
} = cartSlice.actions;

export default cartSlice.reducer;
