// src/store/themeStore.ts
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
	mode: ThemeMode;
	resolved: 'light' | 'dark';
	setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
	const savedMode =
		(localStorage.getItem('themeMode') as ThemeMode) || 'system';

	const resolve = (mode: ThemeMode) => {
		if (mode === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		}
		return mode;
	};

	return {
		mode: savedMode,
		resolved: resolve(savedMode),
		setMode: (mode) => {
			localStorage.setItem('themeMode', mode);
			set({ mode, resolved: resolve(mode) });
		},
	};
});
