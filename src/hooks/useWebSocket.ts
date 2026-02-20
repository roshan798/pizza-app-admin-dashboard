import { useEffect } from 'react';
import { useWebSocketStore } from '../store/websocketStore';
import { useUserStore } from '../store/userStore';

export const useWebSocket = () => {
	const { user } = useUserStore();
	const { connect, disconnect, isConnected } = useWebSocketStore();

	console.log('🔌 [useWebSocket] Hook initialized. User:', {
		userId: user?.id,
		tenantId: user?.tenantId,
		role: user?.role,
	});

	useEffect(() => {
		if (user?.tenantId) {
			console.log(
				'🔌 [useWebSocket] Connecting WebSocket for tenant:',
				user.tenantId
			);
			connect(String(user.tenantId));

			// Cleanup on unmount or tenant change
			return () => {
				console.log(
					'🔌 [useWebSocket] Disconnecting WebSocket for tenant:',
					user.tenantId
				);
				disconnect();
			};
		} else {
			console.log(
				'🔌 [useWebSocket] No tenantId in user, skipping connection'
			);
			// Disconnect if no tenant
			disconnect();
		}
	}, [user?.tenantId, connect, disconnect]); // Fixed: depend on tenantId change

	return {
		isConnected,
		orders: useWebSocketStore((state) => state.orders),
		addOrder: useWebSocketStore((state) => state.addOrder),
		updateOrder: useWebSocketStore((state) => state.updateOrder),
	};
};
