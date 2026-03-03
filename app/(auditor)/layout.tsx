import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { HiOutlineClipboardDocumentCheck, HiArrowRightOnRectangle } from "react-icons/hi2";

export default async function AuditorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.accessToken) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Slim sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200">
          <Image
            src="/app_logo/Official Logo.svg"
            alt="Farmera logo"
            width={32}
            height={32}
            priority
          />
          <div>
            <span className="font-semibold text-gray-900 text-sm block">Farmera</span>
            <span className="text-xs text-gray-400">Auditor Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          <Link
            href="/verification"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <HiOutlineClipboardDocumentCheck className="w-5 h-5" />
            Verification Queue
          </Link>
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
              {session.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{session.email}</p>
              <p className="text-xs text-gray-400">{session.role}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
