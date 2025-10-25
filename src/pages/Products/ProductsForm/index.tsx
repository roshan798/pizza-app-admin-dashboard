import { Form } from 'antd';
import { useProductFormData } from './useProductFormData';
import { ProductForm } from './ProductForm';

export default function ProductsFormPage() {
	const [form] = Form.useForm();
	const data = useProductFormData(form);

	return (
		<ProductForm
			isEdit={data.isEdit}
			form={form}
			fileList={data.fileList}
			setFileList={data.setFileList}
			categoryList={data.categoryList}
			selectedCategory={data.selectedCategory}
			selectedCategoryId={data.selectedCategoryId}
			setSelectedCategoryId={data.setSelectedCategoryId}
			loadingDetail={data.loadingDetail}
			loadingList={data.loadingList}
			loadingProduct={data.loadingProduct}
			productId={data.isEdit ? data.id : undefined}
			selectedTenantId={data.selectedTenantId}
			setSelectedTenantId={data.setSelectedTenantId}
		/>
	);
}
