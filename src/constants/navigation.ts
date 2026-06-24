import {
  LayoutDashboard,
  Map,
  Building2,
  Home,
  Users,
  CalendarCheck,
  FileText,
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
  FileTextIcon,
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
    title: "Properties",
    href: "/properties",
    icon: Home,
    permission: "property.view",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Map,
    permission: "project.view",
  },
  {
    title: "Leads / CRM",
    href: "/leads",
    icon: UserCircle,
    permission: "crm.view",
  },
  {
    title: "Units",
    href: "/units",
    icon: Building2,
    permission: "property.view",
  },

  {
    title: "Leases",
    href: "/leases",
    icon: FileText,
    permission: "property.view",
  },

  {
    title: "Tenants",
    href: "/tenants",
    icon: Users,
    permission: "property.view",
  },
  {
    title: "Work Orders",
    href: "/dashboard/work-orders",
    icon: Wrench,
    permission: "maintenance.view",
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Truck,
    permission: "procurement.view",
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileTextIcon,
    permission: "property.view",
  },
  {
    title: "Finance",
    href: "/finance",
    icon: Landmark,
    permission: "finance.view",
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