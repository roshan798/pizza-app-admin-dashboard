import { Button, Card, Form, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// React import not required with new JSX transform

interface Props {
	fileList: UploadFile[];
	setFileList: (fl: UploadFile[]) => void;
	name?: string;
	label?: string;
	isEdit?: boolean;
}

export function ImageUploadCard({
	fileList,
	setFileList,
	name = 'image',
	label = 'Image',
	isEdit = false,
}: Props) {
	return (
		<Card title={`${label}`} style={{ marginBottom: 24 }} type="inner">
			<Form.Item
				label={label}
				name={name}
				valuePropName="fileList"
				getValueFromEvent={(e) =>
					e && e.fileList ? e.fileList : fileList
				}
				rules={
					isEdit
						? []
						: [
								{
									required: true,
									message: `Please upload an ${label.toLowerCase()}`,
								},
							]
				}
			>
				<Upload
					listType="picture-card"
					fileList={fileList}
					beforeUpload={() => false}
					maxCount={1}
					onChange={({ fileList: fl }) => {
						setFileList(fl);
					}}
					onPreview={(file) => {
						const url =
							(file.url || (file.thumbUrl as string)) ?? '';
						if (url)
							window.open(url, '_blank', 'noopener,noreferrer');
					}}
				>
					{fileList.length >= 1 ? null : (
						<Button icon={<UploadOutlined />}>Upload</Button>
					)}
				</Upload>
			</Form.Item>
		</Card>
	);
}

export default ImageUploadCard;
