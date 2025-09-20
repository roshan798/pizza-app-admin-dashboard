import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNotification } from '../../../hooks/useNotification';
import type { ApiError } from '../../../types';
import { mapServerFormErrors } from '../../../utils';
import { deleteUserById, getAllUsers } from '../../../http/Auth/users';
import type { User } from '../../../store/userStore';

export const useUsers = () => {
	const queryClient = useQueryClient();
	const notify = useNotification();

	const { data: users, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: async (): Promise<User[]> => {
			const { data } = await getAllUsers();
			return data.users as User[];
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteUserById(String(id)),
		onSuccess: () => {
			message.success('User deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: unknown) => {
			const apiError = error as ApiError;
			const fieldErrors = mapServerFormErrors(apiError.response?.data);

			if (fieldErrors.general) {
				notify('error', fieldErrors.general);
			} else {
				console.error(error);
			}
		},
	});

	return { users, isLoading, deleteMutation };
};
