import { ButtonHTMLAttributes, ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ButtonVariant = "primary" | "danger" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && <AiOutlineLoading3Quarters className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
