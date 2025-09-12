import { Modal } from 'antd';
import type { User } from '../types/types';

interface ConfirmDeleteModalProps {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading: boolean;
	user: User | null;
}

export default function ConfirmDeleteModal({
	open,
	onConfirm,
	onCancel,
	isLoading,
	user,
}: ConfirmDeleteModalProps) {
	return (
		<Modal
			title="Confirm Delete"
			open={open}
			onOk={onConfirm}
			confirmLoading={isLoading}
			onCancel={onCancel}
			okText="Yes, Delete"
			cancelText="Cancel"
			okButtonProps={{ danger: true }}
		>
			<p>
				Are you sure you want to delete <b>{user?.email}</b>?
			</p>
		</Modal>
	);
}
