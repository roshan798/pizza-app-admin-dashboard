import { createContext } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationContextType {
	notify: (
		type: NotificationType,
		message: string,
		description?: string
	) => void;
}

export const NotificationContext =
	createContext<NotificationContextType | null>(null);
