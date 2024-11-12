import { configureStore } from '@reduxjs/toolkit';
import userReducer, { JWT_PERSISTENT_STATE } from './user.slice';
import { saveState } from './storage';
import cartReducer, { CART_PERSISTENT_STATE } from './cart.slice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		cart: cartReducer
	}
});

store.subscribe(() => {
	saveState({jwt: store.getState().user.jwt}, JWT_PERSISTENT_STATE);	
	saveState(store.getState().cart.items, CART_PERSISTENT_STATE);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;