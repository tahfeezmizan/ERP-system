"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANIES } from "@/constants/app";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetNotificationsQuery } from "@/services/dashboardApi";
import { logout, setCompany } from "@/store/slices/authSlice";
import { setSidebarMobileOpen } from "@/store/slices/uiSlice";
import { Bell, Building2, LogOut, Menu, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function TopNavbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const companyId = useAppSelector((state) => state.auth.companyId);
  const { data: notifications = [] } = useGetNotificationsQuery();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => dispatch(setSidebarMobileOpen(true))}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden md:block flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Global search..." className="pl-9" />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Select
          value={companyId}
          onValueChange={(v) => dispatch(setCompany(v))}
        >
          <SelectTrigger className="hidden sm:flex w-[300px] h-9 overflow-hidden">
            <Building2 className="h-4 w-4 mr-1 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {COMPANIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.code} - {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="danger"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 bg-white">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">
                  {n.message}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>
              <div>{user?.name}</div>
              <div className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
