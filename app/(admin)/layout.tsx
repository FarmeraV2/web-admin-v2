import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCheckBadge,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { MdAgriculture } from "react-icons/md";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <HiOutlineHome className="w-5 h-5" />,
  },
  {
    href: "/users",
    label: "Users",
    icon: <HiOutlineUsers className="w-5 h-5" />,
  },
  {
    href: "/farms",
    label: "Farms",
    icon: <MdAgriculture className="w-5 h-5" />,
  },
  {
    href: "/products",
    label: "Products",
    icon: <HiOutlineCube className="w-5 h-5" />,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
  },
  {
    label: "Config",
    icon: <HiOutlineCog6Tooth className="w-5 h-5" />,
    children: [
      { href: "/config/categories", label: "Categories" },
      { href: "/config/steps", label: "Crop Steps" },
    ],
  },
  {
    href: "/auditors",
    label: "Auditors",
    icon: <HiOutlineShieldCheck className="w-5 h-5" />,
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.accessToken) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200">
          <Image
            src="/app_logo/Official Logo.svg"
            alt="Farmera logo"
            width={32}
            height={32}
            priority
          />
          <span className="font-semibold text-gray-900 text-sm">Farmera Admin</span>
        </div>

        {/* Client component — handles active state via usePathname */}
        <SidebarNav items={navItems} />

        {/* User footer */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold flex-shrink-0">
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
