"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSalesReportQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";
import type { Booking } from "@/types";

const REPORT_CATEGORIES = [
  "Unit Wise Sales",
  "Project Wise Sales",
  "Collection Report",
  "Due Report",
  "Trial Balance",
  "Balance Sheet",
  "VAT Report",
  "Material Consumption",
];

export default function ReportsPage() {
  const { data, isLoading } = useGetSalesReportQuery({ page: 1, pageSize: 10 });
  const bookings = data?.data ?? [];

  const columns: Column<Booking>[] = [
    { key: "bookingNo", header: "Booking No", cell: (r) => r.bookingNo },
    { key: "customerName", header: "Customer", cell: (r) => r.customerName },
    { key: "projectName", header: "Project", cell: (r) => r.projectName },
    { key: "totalPrice", header: "Amount", cell: (r) => formatBDT(r.totalPrice) },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Sales, collection, finance, and construction reports">
        <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export All</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REPORT_CATEGORIES.map((report) => (
          <Card key={report} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{report}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" className="w-full">Generate</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Sales Report Preview</h2>
        <DataTable columns={columns} data={bookings} isLoading={isLoading} searchKeys={["bookingNo", "customerName"]} />
      </div>
    </div>
  );
}
