import {
  LayoutDashboard,
  Map,
  Building2,
  Home,
  Users,
  CalendarCheck,
  Wallet,
  UserCircle,
  HardHat,
  ShoppingCart,
  Package,
  Truck,
  Landmark,
  Briefcase,
  Wrench,
  BarChart3,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export const MAIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Land Management",
    href: "/land",
    icon: Map,
    permission: "land.view",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Building2,
    permission: "project.view",
  },
  {
    title: "Properties",
    href: "/properties",
    icon: Home,
    permission: "property.view",
  },
  {
    title: "Sales CRM",
    href: "/crm",
    icon: Users,
    permission: "crm.view",
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: CalendarCheck,
    permission: "booking.view",
  },
  {
    title: "Collections",
    href: "/collections",
    icon: Wallet,
    permission: "collection.view",
  },
  {
    title: "Customers",
    href: "/customers",
    icon: UserCircle,
    permission: "customer.view",
  },
  {
    title: "Construction",
    href: "/construction",
    icon: HardHat,
    permission: "construction.view",
  },
  {
    title: "Procurement",
    href: "/procurement",
    icon: ShoppingCart,
    permission: "procurement.view",
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
    permission: "inventory.view",
  },
  {
    title: "Contractors",
    href: "/contractors",
    icon: Truck,
    permission: "contractor.view",
  },
  {
    title: "Accounts & Finance",
    href: "/finance",
    icon: Landmark,
    permission: "finance.view",
  },
  {
    title: "HR & Payroll",
    href: "/hr",
    icon: Briefcase,
    permission: "hr.view",
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    permission: "maintenance.view",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    permission: "report.view",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    permission: "settings.view",
  },
  {
    title: "Administration",
    href: "/administration",
    icon: Shield,
    permission: "admin.view",
  },
];
