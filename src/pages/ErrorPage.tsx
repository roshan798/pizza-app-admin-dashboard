import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ResultStatusType } from 'antd/es/result';

interface ErrorPageProps {
	message?: string;
	status?: ResultStatusType;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
	message = 'You are not authorized to access this page.',
	status = 403,
}) => {
	const navigate = useNavigate();

	return (
		<Result
			status={status}
			title={status}
			subTitle={message}
			extra={
				<Button type="primary" onClick={() => navigate('/')}>
					Go Home
				</Button>
			}
		/>
	);
};

export default ErrorPage;
