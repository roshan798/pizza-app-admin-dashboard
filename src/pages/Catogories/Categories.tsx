import { Table, Button, Space, Card, Typography, Dropdown, Menu } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories as fetchCategoriesAPI } from '../../http/Catalog/categories';
import { Link } from 'react-router-dom';
import type { Category } from '../../http/Catalog/types';
import { toDateTime } from '../../utils';

const { Title } = Typography;

const fetchCategories = async () => {
	const res = await fetchCategoriesAPI();
	return res.data.data;
};

export default function CategoriesPage() {
	// const queryClient = useQueryClient();
	// const navigate = useNavigate();

	const { data, isLoading, isError } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: fetchCategories,
	});

	// const deleteMutation = useMutation({
	// 	mutationFn: deleteCategory,
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries({ queryKey: ['categories'] });
	// 	},
	// });

	const handleDelete = (id: string) => {
		console.log(id);

		// uncomment to DELETE
		//deleteMutation.mutate(id);
	};

	const columns: ColumnsType<Category> = [
		{
			title: 'Category Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
			render: (text: string, record: Category) => (
				<Link to={`/categories/${record.id}`}>{text}</Link>
			),
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a, b) =>
				new Date(a.createdAt || 0).getTime() -
				new Date(b.createdAt || 0).getTime(),
			defaultSortOrder: 'descend',
			render: (val?: string) => toDateTime(val),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => {
				const menu = (
					<Menu>
						<Menu.Item key="view">
							<Link to={`/categories/${record.id}`}>View</Link>
						</Menu.Item>
						<Menu.Item key="edit">
							<Link to={`/categories/edit/${record.id}`}>
								Edit
							</Link>
						</Menu.Item>
						<Menu.Item
							key="delete"
							danger
							onClick={() => handleDelete(record.id!)}
						>
							Delete
						</Menu.Item>
					</Menu>
				);

				return (
					<Dropdown overlay={menu} trigger={['click']}>
						<Button icon={<MoreOutlined />} />
					</Dropdown>
				);
			},
		},
	];

	return (
		<Card>
			<Space
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<Title level={4} style={{ margin: 0 }}>
					Categories
				</Title>
				<Button type="primary" icon={<PlusOutlined />}>
					<Link to="/categories/create">Create Category</Link>
				</Button>
			</Space>

			<Table
				rowKey="id"
				loading={isLoading}
				columns={columns}
				dataSource={data || []}
				pagination={false}
			/>

			{isError && (
				<div style={{ color: 'red' }}>Failed to load categories</div>
			)}
		</Card>
	);
}
