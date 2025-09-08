import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { NotificationProvider } from './context/NotificationProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const theme = {
	token: {
		colorPrimary: '#f65f42',
	},
};
const query = new QueryClient();
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ConfigProvider theme={theme}>
			<BrowserRouter>
				<NotificationProvider>
					<QueryClientProvider client={query}>
						<App />
					</QueryClientProvider>
				</NotificationProvider>
			</BrowserRouter>
		</ConfigProvider>
	</StrictMode>
);
