import { Button, Form, Upload } from 'antd';
import type { FormInstance, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { ProductFormValues } from '../useProductFormData';

interface Props {
	isEdit: boolean;
	fileList: UploadFile[];
	setFileList: (fl: UploadFile[]) => void;
	form: FormInstance<ProductFormValues>;
}

export function ImageUploadSection({
	isEdit,
	fileList,
	setFileList,
	form,
}: Props) {
	return (
		<Form.Item
			label="Product Image"
			name="image"
			valuePropName="fileList"
			getValueFromEvent={(e) => (e && e.fileList ? e.fileList : fileList)}
			rules={
				isEdit
					? []
					: [{ required: true, message: 'Please upload an image' }]
			}
		>
			<Upload
				listType="picture-card"
				fileList={fileList}
				beforeUpload={() => false}
				maxCount={1}
				onChange={({ fileList: fl }) => {
					setFileList(fl);
					form.setFieldsValue({ image: fl });
				}}
				onPreview={(file) => {
					const url = (file.url || (file.thumbUrl as string)) ?? '';
					if (url) window.open(url, '_blank', 'noopener,noreferrer');
				}}
			>
				{fileList.length >= 1 ? null : (
					<Button icon={<UploadOutlined />}>Upload</Button>
				)}
			</Upload>
		</Form.Item>
	);
}
