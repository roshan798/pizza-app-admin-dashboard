import { notification } from 'antd';
import {
	NotificationContext,
	type NotificationType,
} from './NotificationContext';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [api, contextHolder] = notification.useNotification();

	const notify = (
		type: NotificationType,
		message: string,
		description?: string
	) => {
		api[type]({
			message,
			description,
			placement: 'topRight', // 👈 always top-right
		});
	};

	return (
		<NotificationContext.Provider value={{ notify }}>
			{contextHolder}
			{children}
		</NotificationContext.Provider>
	);
};
