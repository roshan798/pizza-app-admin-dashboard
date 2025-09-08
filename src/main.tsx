import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { NotificationProvider } from './context/NotificationProvider.tsx';

const theme = {
	token: {
		colorPrimary: '#f65f42',
	},
};
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ConfigProvider theme={theme}>
			<BrowserRouter>
				<NotificationProvider>
					<App />
				</NotificationProvider>
			</BrowserRouter>
		</ConfigProvider>
	</StrictMode>
);
