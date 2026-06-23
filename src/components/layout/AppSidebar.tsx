"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { MAIN_NAV } from "@/constants/navigation";
import { APP_NAME } from "@/constants/app";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setSidebarCollapsed, setSidebarMobileOpen } from "@/store/slices/uiSlice";
import { usePermissions } from "@/hooks/usePermissions";

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const mobileOpen = useAppSelector((state) => state.ui.sidebarMobileOpen);
  const { can } = usePermissions();

  const filteredNav = MAIN_NAV.filter(
    (item) => !item.permission || can(item.permission)
  );

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">{APP_NAME}</span>
            <span className="text-[10px] text-muted-foreground">Enterprise Edition</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:flex hidden"
          onClick={() => dispatch(setSidebarCollapsed(!collapsed))}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          onClick={() => dispatch(setSidebarMobileOpen(false))}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => dispatch(setSidebarMobileOpen(false))}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => dispatch(setSidebarMobileOpen(false))}
        />
      )}
      <aside
        className={cn(
          "fixed h-dvh inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300 lg:static lg:z-auto",
          collapsed ? "w-[70px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
