import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminRoute from './routes/AdminRoute';
import AuthRoute from './routes/AuthRoute';
import Users from './pages/users/Users';
import CreateOrUpdateUser from './pages/users/CreateOrUpdateUser';

function App() {
	return (
		<>
			<Routes>
				{/* Public routes */}
				<Route element={<AuthLayout />}>
					<Route element={<AuthRoute />}>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Route>
				</Route>

				{/* Private routes */}
				<Route element={<AdminRoute />}>
					<Route element={<MainLayout />}>
						<Route path="/" element={<Home />} />
						<Route path="/category" element={<Category />} />
						<Route path="/users" element={<Users />} />
						<Route
							path="/users/create"
							element={<CreateOrUpdateUser />}
						/>
						<Route
							path="/users/edit/:userId"
							element={<CreateOrUpdateUser />}
						/>
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
