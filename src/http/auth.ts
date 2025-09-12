import type { AxiosResponse } from 'axios';
import CONFIG from '../config.ts';
import type { LoginPayload, SignupPayload } from '../types/Payloads.ts';
import auth from './index.ts';
import type { User } from '../store/userStore.ts';
import type { SuccessResponse } from '../types/index.ts';

export const login = async (payload: LoginPayload) => {
	return await auth.post(CONFIG.auth.login, payload);
};
export const signup = async (payload: SignupPayload) => {
	return await auth.post(CONFIG.auth.signup, payload);
};
export const self: () => Promise<
	AxiosResponse<SuccessResponse & { user: User }>
> = async () => {
	return await auth.get(CONFIG.auth.self);
};
export const logout = async () => {
	return await auth.post(CONFIG.auth.logout);
};
