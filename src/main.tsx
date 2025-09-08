
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#f65f42',
				},
			}}
		>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ConfigProvider>
	</StrictMode>
);
