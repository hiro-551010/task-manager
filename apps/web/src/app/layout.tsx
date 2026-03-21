import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { logoutAction } from "@/lib/actions/auth-actions";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/tasks" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Tasks
            </Link>
            <div className="ml-auto">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
