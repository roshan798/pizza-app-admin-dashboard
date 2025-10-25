import './index.css';
import { ConfigProvider, Spin, theme as antdTheme } from 'antd';
import { NotificationProvider } from './context/NotificationProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes.ts';
import { Suspense, useEffect } from 'react';
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
					fontFamily:
						"Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
				},
			}}
		>
			<NotificationProvider>
				<QueryClientProvider client={query}>
					<Suspense
						fallback={
							<div
								className="fallback-spinner"
								style={{
									display: 'flex',
									height: '100vh',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Spin size="large" />
							</div>
						}
					>
						<RouterProvider router={router} />
					</Suspense>
				</QueryClientProvider>
			</NotificationProvider>
		</ConfigProvider>
	);
};

export default App;
