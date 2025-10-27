import { Button, Space, Typography } from 'antd';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Props {
	title: string;
	editPath: string;
	id?: string | number;
	allowedRoles?: string[];
}

export default function PreviewHeader({
	title,
	editPath,
	id,
	allowedRoles = ['admin', 'manager'],
}: Props) {
	const { user } = useUserStore();
	const navigate = useNavigate();

	const canEdit = user && allowedRoles.includes(user.role);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: 12,
			}}
		>
			<div style={{ minWidth: 0 }}>
				<Title level={3} style={{ margin: 0 }}>
					{title}
				</Title>
			</div>
			<Space>
				{canEdit ? (
					<Button
						type="primary"
						onClick={() =>
							navigate(`${editPath}${id ? `/${id}` : ''}`)
						}
					>
						Edit
					</Button>
				) : null}
			</Space>
		</div>
	);
}
