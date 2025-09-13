import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import RootRoute from './RootRoute';
import AdminRoute from './AdminRoute';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';

import ErrorPage from '../pages/ErrorPage';
import AuthRoute from './AuthRoute';
import Tenants from '../pages/tenants/Tenants';
import Users from '../pages/users/Users';
import CreateOrUpdateUser from '../pages/users/CreateOrUpdateUser';
import CreateOrUpdateTenant from '../pages/tenants/CreateOrUpdateTenant';
import ProfilePage from '../pages/users/ProfilePage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: React.createElement(RootRoute),
		errorElement: React.createElement(ErrorPage),
		children: [
			// --- Public routes (login/signup) ---
			{
				element: React.createElement(AuthRoute),
				children: [
					{
						element: React.createElement(AuthLayout),
						children: [
							{
								path: 'login',
								element: React.createElement(Login),
							},
							{
								path: 'signup',
								element: React.createElement(Signup),
							},
						],
					},
				],
			},

			// --- Admin routes ---
			{
				element: React.createElement(MainLayout),
				errorElement: React.createElement(ErrorPage),
				children: [
					{
						element: React.createElement(AdminRoute),
						children: [
							{
								path: 'users',
								element: React.createElement(Users),
							},
							{
								path: 'users/create',
								element:
									React.createElement(CreateOrUpdateUser),
							},
							{
								path: 'users/edit/:userId',
								element:
									React.createElement(CreateOrUpdateUser),
							},
							{
								path: 'tenants',
								element: React.createElement(Tenants),
							},
							{
								path: 'tenants/create',
								element:
									React.createElement(CreateOrUpdateTenant),
							},
							{
								path: 'tenants/edit/:id',
								element:
									React.createElement(CreateOrUpdateTenant),
							},
						],
					},
				],
			},

			// --- Authenticated (any role, not necessarily admin) ---
			{
				element: React.createElement(MainLayout),
				errorElement: React.createElement(ErrorPage),
				children: [
					{ index: true, element: React.createElement(Home) },
					{ path: 'me', element: React.createElement(ProfilePage) },
				],
			},
		],
	},
]);
