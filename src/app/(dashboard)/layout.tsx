import { AuthGuard } from "@/components/shared/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
