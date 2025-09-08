import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
	return (
		<div className="mb-2">
			<label className="block text-sm font-medium mb-1">{label}</label>
			<input
				{...props}
				className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100 ${
					error ? 'border-red-500' : 'border-gray-300'
				}`}
			/>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};

export default Input;
