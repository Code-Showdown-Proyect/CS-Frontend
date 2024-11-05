interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'disabled';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
    const baseStyles = "flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    const variantStyles = {
        primary: "bg-[#0a0020] text-white shadow-sm hover:bg-[#0a0020d6] focus-visible:outline-indigo-600",
        secondary: "bg-white text-gray-800 hover:bg-indigo-100 border border-gray-400",
        danger: "bg-red-500 text-white hover:bg-red-700",
        success: "bg-green-500 text-white hover:bg-green-700",
        info: "bg-blue-200 text-blue-800 hover:bg-blue-300",
        disabled: "bg-gray-400 text-gray-200 cursor-not-allowed",
    };

    return (
        <button className={`${baseStyles} ${variantStyles[variant]}`} disabled={variant === 'disabled'} {...props}>
            {children}
        </button>
    );
};

export default Button;