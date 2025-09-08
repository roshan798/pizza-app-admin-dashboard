import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
	return (
		<button
			{...props}
			className={`w-full bg-primary text-white font-semibold py-2 rounded-full hover:bg-orange-600 transition cursor-pointer ${className}`}
		>
			{children}
		</button>
	);
};

export default Button;
