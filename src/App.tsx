import './index.css';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { NotificationProvider } from './context/NotificationProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes.ts';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore.ts';

const query = new QueryClient();

const App = () => {
	const { mode, resolved, setMode } = useThemeStore();

	useEffect(() => {
		if (mode === 'system') {
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			const update = () => setMode('system');
			mq.addEventListener('change', update);
			return () => mq.removeEventListener('change', update);
		}
	}, [mode, setMode]);

	return (
		<ConfigProvider
			theme={{
				algorithm:
					resolved === 'dark'
						? antdTheme.darkAlgorithm
						: antdTheme.defaultAlgorithm,
				token: {
					colorPrimary: '#f65f42',
					colorBgLayout: resolved === 'dark' ? '#1f1f1f' : '#fff',
					colorText: resolved === 'dark' ? '#fff' : '#000',
					colorBgContainer: resolved === 'dark' ? '#141414' : '#fff',
				},
			}}
		>
			<NotificationProvider>
				<QueryClientProvider client={query}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</NotificationProvider>
		</ConfigProvider>
	);
};

export default App;
