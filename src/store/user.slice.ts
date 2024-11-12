import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState } from './storage';
import axios from 'axios';
import { LoginResponse } from '../interfaces/auth.interface';
import { PREFIX } from '../helpers/API';
import { ProfileResponse } from '../interfaces/profile.interface';
import { RootState } from './store';

export const JWT_PERSISTENT_STATE = 'userData';

export interface UserPersistentState {
	jwt: string | null
}

export interface UserState {
    jwt: string | null,
	errorState?: string,
	profile?: ProfileResponse
}

const initialState: UserState = {
	jwt: loadState<UserPersistentState>(JWT_PERSISTENT_STATE)?.jwt ?? null,
	errorState: undefined,
	profile: undefined
};

export const login = createAsyncThunk('user/login',
	async (params : {email: string, password: string}) => {
		const { data } = await axios.post<LoginResponse>(`${PREFIX}/auth/login`, {
			email: params.email,
			password: params.password 
		});	
		return data;
	}
);

export const getProfile = createAsyncThunk<ProfileResponse, void, {state: RootState}>('user/getProfile',
	async (_, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.get<ProfileResponse>(`${PREFIX}/user/profile`, {
			headers: {
				Authorization: `Bearer ${jwt}`
			}
		});
		return data;
	}
);

export const register = createAsyncThunk('user/sendRegister', 
	async (params : {email: string, password: string, name: string}) => {
		const { data } = await axios.post<LoginResponse>(`${PREFIX}/auth/register`, {
			email: params.email,
			password: params.password,
			name: params.name
		});
		return data;
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.jwt = null;
		},
		clearError: (state) => {
			state.errorState = undefined;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
			state.jwt = action.payload.access_token;	
		});
		builder.addCase(login.rejected, (state, action) => {
			state.errorState = action.error.message;
		});
		builder.addCase(getProfile.fulfilled, (state, action) => {
			state.profile = action.payload;
		});
		builder.addCase(register.fulfilled, (state, action) => {
			state.jwt = action.payload.access_token;
		});
		builder.addCase(register.rejected, (state, action) => {
			state.errorState = action.error.message;
		});
	}	
}
);

export default userSlice.reducer;
export const userActions = userSlice.actions;