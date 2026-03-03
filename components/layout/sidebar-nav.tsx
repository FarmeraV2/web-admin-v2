"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  children?: NavChild[];
}

interface SidebarNavProps {
  items: NavItem[];
}

function NavLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-green-50 text-green-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon && (
        <span className={isActive ? "text-green-600" : "text-gray-400"}>
          {icon}
        </span>
      )}
      {label}
    </Link>
  );
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      {items.map((item) =>
        item.children ? (
          <div key={item.label}>
            <div className="flex items-center gap-3 px-3 py-2 mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </div>
            {item.children.map((child) => {
              const isActive = pathname === child.href || pathname.startsWith(child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 pl-9 text-sm transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        ) : (
          <NavLink key={item.href} href={item.href!} label={item.label} icon={item.icon} />
        )
      )}
    </nav>
  );
}
