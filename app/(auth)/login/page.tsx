import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-4">
            <Image
              src="/app_logo/Official Logo.svg"
              alt="Farmera logo"
              width={64}
              height={64}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Farmera Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your admin account</p>
        </div>

        {/* Card — LoginForm is the only client boundary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Farmera Admin Panel — internal use only
        </p>
      </div>
    </div>
  );
}
