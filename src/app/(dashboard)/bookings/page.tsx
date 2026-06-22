"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetBookingsQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";
import type { Booking } from "@/types";

export default function BookingsPage() {
  const { data = [], isLoading } = useGetBookingsQuery();

  const columns: Column<Booking>[] = [
    { key: "bookingNo", header: "Booking No", cell: (r) => r.bookingNo, sortable: true },
    { key: "customerName", header: "Customer", cell: (r) => r.customerName, sortable: true },
    { key: "unitNumber", header: "Unit", cell: (r) => r.unitNumber },
    { key: "projectName", header: "Project", cell: (r) => r.projectName },
    { key: "bookingDate", header: "Date", cell: (r) => r.bookingDate, sortable: true },
    { key: "bookingAmount", header: "Booking Amt", cell: (r) => formatBDT(r.bookingAmount) },
    { key: "totalPrice", header: "Total Price", cell: (r) => formatBDT(r.totalPrice), sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description="Apartment, parking, and shop booking management">
        <Button><Plus className="h-4 w-4 mr-1" /> New Booking</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["bookingNo", "customerName", "unitNumber"]} />
    </div>
  );
}
