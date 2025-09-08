import { create } from 'zustand';
import type { Roles } from '../types';

export const useUserStore = create<UserState>((set) => ({
	user: null,
	id: null,
	setUser: (user) => {
		console.log('[USER STORE] - setting user : ', user);
		return set({ user });
	},
	setId: (id) => {
		console.log('[USER STORE] - setting id : ', id);
		return set({ id });
	},
	logout() {
		console.log('[USER STORE] - Logout');

		return set({
			id: null,
			user: null,
		});
	},
}));
// ------TYPES ------------//

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: Roles;
}

export interface UserState {
	user: User | null;
	id: string | null;
	setUser: (user: User | null) => void;
	setId: (id: string | null) => void;
	logout: () => void;
}
