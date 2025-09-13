import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => {
	return (
		<Footer
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text>
				&copy; {new Date().getFullYear()} Pizza Delivery App. All rights
				reserved.
			</Text>
		</Footer>
	);
};

export default AppFooter;
