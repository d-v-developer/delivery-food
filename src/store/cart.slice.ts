import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState } from './storage';

export const CART_PERSISTENT_STATE = 'cartData';

export interface CartItem {
    id: number,
    count: number
}

export interface CartState {
    items: CartItem[],
	currentOrder?: number;
}

const initialState: CartState = {
	items: loadState<CartItem[]>(CART_PERSISTENT_STATE) ?? [],
	currentOrder: 0
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		increase: (state, action: PayloadAction<number>) => {
			const existed = state.items.find(i => i.id === action.payload);
			if (!existed) {
				state.items.push({ id: action.payload, count: 1});
			} else {
				state.items.map(i => {
					if (i.id === action.payload) {
						i.count += 1;
					}
					return i;
				});
			}
		},
		decrease: (state, action: PayloadAction<number>) => {
			const itemCount = state.items.find(i => i.id === action.payload)?.count;
			if (itemCount === 1) {
				state.items = state.items.filter(i => i.id !== action.payload);
			}
			state.items.map(i => {
				if (i.id === action.payload) {
					i.count -= 1;
				}
				return i;
			});
		},
		delete: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(i => i.id !== action.payload);	
		},
		newOrder: (state, action: PayloadAction<number>) => {
			state.currentOrder = action.payload;
		},
		clearCart: (state) => {
			state.items = [];
		}   
	} 
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;