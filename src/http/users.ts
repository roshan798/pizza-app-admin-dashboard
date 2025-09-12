import api from '.';
import CONFIG from '../config';
import type { Roles } from '../types';

export const getAllUsers = async () => {
	return await api.get(CONFIG.users.url);
};

export const getUserById = async (userId: string) => {
	return await api.get(CONFIG.users.url + '/' + userId);
};

export const createUser = async (payload: CreateUserPayload) => {
	return await api.post(CONFIG.users.url, payload);
};

export const updateUserById = async (
	userId: string,
	payload: UpdateUserPayload
) => {
	return await api.put(CONFIG.users.url + '/' + userId, payload);
};

export const deleteUserById = async (userId: string) => {
	return await api.delete(CONFIG.users.url + '/' + userId);
};

export interface CreateUserPayload {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: Roles;
	tenantId?: string;
}
export interface UpdateUserPayload extends Omit<CreateUserPayload, 'password'> {
	id: string;
}
