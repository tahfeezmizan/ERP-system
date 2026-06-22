"use client";

import { useTheme } from "next-themes";
import {
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  Globe,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { COMPANIES, FISCAL_YEARS } from "@/constants/app";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout, setCompany, setFiscalYear } from "@/store/slices/authSlice";
import { setSidebarMobileOpen } from "@/store/slices/uiSlice";
import {
  useGetNotificationsQuery,
  useGetTasksQuery,
} from "@/services/dashboardApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const companyId = useAppSelector((state) => state.auth.companyId);
  const fiscalYear = useAppSelector((state) => state.auth.fiscalYear);
  const { data: notifications = [] } = useGetNotificationsQuery();
  const { data: tasks = [] } = useGetTasksQuery();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
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
          <SelectTrigger className="hidden sm:flex w-[180px] h-9">
            <Building2 className="h-4 w-4 mr-1 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMPANIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.code} - {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={fiscalYear}
          onValueChange={(v) => dispatch(setFiscalYear(v))}
        >
          <SelectTrigger className="hidden lg:flex w-[130px] h-9">
            <Calendar className="h-4 w-4 mr-1 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FISCAL_YEARS.map((fy) => (
              <SelectItem key={fy} value={fy}>
                FY {fy}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/crm")}>
              New Lead
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/bookings")}>
              New Booking
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/collections")}>
              Record Collection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <CheckSquare className="h-4 w-4" />
              {pendingTasks > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {pendingTasks}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tasks.slice(0, 5).map((task) => (
              <DropdownMenuItem
                key={task.id}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{task.title}</span>
                <span className="text-xs text-muted-foreground">
                  Due: {task.dueDate}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
          <DropdownMenuContent align="end" className="w-80">
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

        <Button variant="ghost" size="icon" title="Language">
          <Globe className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

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
          <DropdownMenuContent align="end">
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
