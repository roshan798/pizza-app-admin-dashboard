import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
	const location = useLocation();
	const pathnames = location.pathname.split('/').filter(Boolean);

	const items = [
		{
			title: <Link to="/">Dashboard</Link>,
		},
		...pathnames.map((value, index) => {
			const to = `/${pathnames.slice(0, index + 1).join('/')}`;
			const isLast = index === pathnames.length - 1;
			const label = value.charAt(0).toUpperCase() + value.slice(1);

			return {
				title: isLast ? (
					<span style={{ fontWeight: 600 }}>{label}</span>
				) : (
					<Link to={to}>{label}</Link>
				),
			};
		}),
	];

	return (
		<Breadcrumb
			items={items}
			separator=" > "
			style={{ marginBottom: 10 }}
		/>
	);
};

export default Breadcrumbs;
