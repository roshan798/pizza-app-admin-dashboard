import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy imports
const RootRoute = lazy(() => import('./RootRoute'));
const AdminRoute = lazy(() => import('./AdminRoute'));
const AuthRoute = lazy(() => import('./AuthRoute'));

const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));

const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Home = lazy(() => import('../pages/Home'));

const ErrorPage = lazy(() => import('../pages/ErrorPage'));

const Tenants = lazy(() => import('../pages/tenants/Tenants'));
const Users = lazy(() => import('../pages/users/Users'));
const CreateOrUpdateUser = lazy(
	() => import('../pages/users/CreateOrUpdateUser')
);
const CreateOrUpdateTenant = lazy(
	() => import('../pages/tenants/CreateOrUpdateTenant')
);
const ProfilePage = lazy(() => import('../pages/users/ProfilePage'));

const CategoriesPage = lazy(() => import('../pages/Catogories/Categories'));
const CategoryDetails = lazy(
	() => import('../pages/Catogories/CategoryDetails')
);
const CategoryFormPage = lazy(
	() => import('../pages/Catogories/CategoryFormPage')
);

const Products = lazy(() => import('../pages/Products/Products'));
const CreateProductForm = lazy(() => import('../pages/Products/CreateProduct'));
const ProductPreviewCustomer = lazy(
	() => import('../pages/Products/ProductPreview')
);

export const router = createBrowserRouter([
	{
		path: '/',
		Component: RootRoute,
		errorElement: React.createElement(ErrorPage),
		children: [
			// --- Public routes (login/signup) ---
			{
				Component: AuthRoute,
				children: [
					{
						Component: AuthLayout,
						children: [
							{ path: 'login', Component: Login },
							{ path: 'signup', Component: Signup },
						],
					},
				],
			},

			// --- Admin routes ---
			{
				Component: MainLayout,
				errorElement: React.createElement(ErrorPage),
				children: [
					{
						Component: AdminRoute,
						children: [
							{ path: 'users', Component: Users },
							{
								path: 'users/create',
								Component: CreateOrUpdateUser,
							},
							{
								path: 'users/edit/:userId',
								Component: CreateOrUpdateUser,
							},
							{ path: 'tenants', Component: Tenants },
							{
								path: 'tenants/create',
								Component: CreateOrUpdateTenant,
							},
							{
								path: 'tenants/edit/:id',
								Component: CreateOrUpdateTenant,
							},
							{ path: 'categories', Component: CategoriesPage },
							{
								path: 'categories/:id',
								Component: CategoryDetails,
							},
							{
								path: 'categories/create',
								Component: CategoryFormPage,
							},
							{
								path: 'categories/edit/:id',
								Component: CategoryFormPage,
							},
							{ path: 'products', Component: Products },
							{
								path: 'products/create',
								Component: CreateProductForm,
							},
							{
								path: 'products/edit/:id',
								Component: CreateProductForm,
							},
							{
								path: 'products/:id',
								Component: ProductPreviewCustomer,
							},
						],
					},
				],
			},

			// --- Authenticated (any role) ---
			{
				Component: MainLayout,
				errorElement: React.createElement(ErrorPage),
				children: [
					{ index: true, Component: Home },
					{ path: 'me', Component: ProfilePage },
				],
			},
		],
	},
]);
