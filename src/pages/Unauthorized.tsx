import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
	const navigate = useNavigate();
	return (
		<Result
			status="403"
			title="Unauthorized"
			subTitle="You do not have permission to access this page."
			extra={
				<Button type="primary" onClick={() => navigate('/')}>
					Go Home
				</Button>
			}
		/>
	);
};

export default Unauthorized;
