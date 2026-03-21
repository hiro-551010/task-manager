"use client";

import { useState } from "react";
import { LoginForm } from "@/components/features/auth/login-form";
import { RegisterForm } from "@/components/features/auth/register-form";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">Task Manager</h1>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "login"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            ログイン
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "register"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            新規登録
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
