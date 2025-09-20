// pages/products/ProductList.tsx
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Button, Space, Avatar, Input, Select, Dropdown, Menu } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Product } from "../../http/Catalog/types";
import { fetchProducts as fetchProductsAPI } from "../../http/Catalog/products";
import { Link, useNavigate } from "react-router-dom";

const { Search } = Input;

const fetchProducts = async () => {
    const res = await fetchProductsAPI();
    return res.data.data;
};

export default function Products() {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const handleMenuClick = (action: string, id: string) => {
        switch (action) {
            case "view":
                navigate(`/products/${id}`);
                break;
            case "edit":
                navigate(`/products/${id}/edit`);
                break;
            case "delete":
                console.log("Delete product", id);
                // TODO: add delete mutation here
                break;
        }
    };

    // Add sorter to required columns
    const columns: ColumnsType<Product> = [
        {
            title: "Product name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name), // string compare
            render: (_, record) => (
                <Space>
                    <Avatar src={record.imageUrl} shape="square" size="large" />
                    <Button type="link" onClick={() => navigate(`/products/${record._id}`)}>
                        {record.name}
                    </Button>
                </Space>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            sorter: (a, b) => (a.description || "").localeCompare(b.description || ""), // string compare
        },
        {
            title: "Category",
            dataIndex: "categoryId",
            key: "category",
            render: () => "Pizza",
            sorter: (a, b) => (a.categoryId || "").localeCompare(b.categoryId || ""), // until real name mapping exists
        },
        {
            title: "Status",
            dataIndex: "isPublished",
            key: "status",
            render: (isPublished: boolean) =>
                isPublished ? <Tag color="green">Published</Tag> : <Tag color="orange">Draft</Tag>,
            sorter: (a, b) => Number(a.isPublished) - Number(b.isPublished), // false < true
        },
        {
            title: "Created at",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) =>
                new Date(date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(), // date compare
            defaultSortOrder: "descend", // optional: newest first
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                const menu = (
                    <Menu
                        onClick={({ key }) => handleMenuClick(key, record._id)}
                        items={[
                            { label: "View", key: "view" },
                            { label: "Edit", key: "edit" },
                            { label: "Delete", key: "delete" },
                        ]}
                    />
                );
                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];


    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Space>
                    <Search placeholder="Search products" style={{ width: 200 }} />
                    <Select placeholder="Category" style={{ width: 150 }}>
                        <Select.Option value="pizza">Pizza</Select.Option>
                        <Select.Option value="drinks">Drinks</Select.Option>
                    </Select>
                    <Select placeholder="Status" style={{ width: 150 }}>
                        <Select.Option value="published">Published</Select.Option>
                        <Select.Option value="draft">Draft</Select.Option>
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />}>
                    <Link to="/products/create">Create Product</Link>
                </Button>
            </div>

            {/* Table */}
            <Table<Product>
                rowKey="_id"
                columns={columns}
                dataSource={data || []}
                loading={isLoading}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}
