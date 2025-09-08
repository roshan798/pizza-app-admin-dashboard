import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    options: { value: string; label: string }[];
    hidden?: boolean; // optional prop
    defaultValue?: string
}

const Select: React.FC<SelectProps> = ({ label, error, options, hidden, defaultValue, ...props }) => {
    if (hidden) return null; 

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select
                {...props}
                className={`w-full border rounded-md px-3 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-red-500" : "border-gray-300"
                    }`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}
                        selected={(defaultValue && defaultValue === option.value) ? true : false}>
                        {option.label}
                    </option>
                ))}
            </select>
            <span
                className="text-red-500 text-xs mt-1 block"
                style={{ visibility: error ? "visible" : "hidden", minHeight: "1em" }}
            >
                {error || "placeholder"}
            </span>
        </div>
    );
};

export default Select;
