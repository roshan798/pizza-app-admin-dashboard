import type { UploadFile } from 'antd';
import ImageUploadCard from '../../../../components/ImageUploadCard';

interface Props {
	isEdit: boolean;
	fileList: UploadFile[];
	setFileList: (fl: UploadFile[]) => void;
}

export function ImageUploadSection({ isEdit, fileList, setFileList }: Props) {
	return (
		<ImageUploadCard
			fileList={fileList}
			setFileList={setFileList}
			name="image"
			label="Product Image"
			isEdit={isEdit}
		/>
	);
}
