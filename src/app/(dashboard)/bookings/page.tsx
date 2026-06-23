"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBDT } from "@/lib/utils";
import { type CreateBookingFormData } from "@/schemas";
import { useCreateBookingMutation, useGetBookingsQuery } from "@/services/moduleApis";
import type { Booking } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function BookingsPage() {
  const { data = [], isLoading, refetch } = useGetBookingsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createBooking] = useCreateBookingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateBookingFormData>({
    defaultValues: {
      customerName: "",
      unitNumber: "",
      projectName: "",
      bookingDate: "",
      bookingAmount: undefined,
      totalPrice: undefined,
    },
  });

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

  async function onSubmit(values: CreateBookingFormData) {
    try {
      await createBooking(values).unwrap();
      toast.success("Booking created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to create booking");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description="Apartment, parking, and shop booking management">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Booking
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKeys={["bookingNo", "customerName", "unitNumber"]}
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="New Booking"
        description="Create a new apartment or unit booking"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="book-customer">Customer Name</Label>
            <Input id="book-customer" placeholder="e.g. Mohammad Hasan" {...register("customerName")} />
            {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="book-unit">Unit Number</Label>
            <Input id="book-unit" placeholder="e.g. A-501" {...register("unitNumber")} />
            {errors.unitNumber && <p className="text-sm text-destructive">{errors.unitNumber.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="book-project">Project Name</Label>
            <Input id="book-project" placeholder="e.g. Green Valley Residency" {...register("projectName")} />
            {errors.projectName && <p className="text-sm text-destructive">{errors.projectName.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="book-date">Booking Date</Label>
            <Input id="book-date" type="date" {...register("bookingDate")} />
            {errors.bookingDate && <p className="text-sm text-destructive">{errors.bookingDate.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="book-amount">Booking Amount (৳)</Label>
            <Input id="book-amount" type="number" placeholder="e.g. 500000" {...register("bookingAmount")} />
            {errors.bookingAmount && <p className="text-sm text-destructive">{errors.bookingAmount.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="book-total">Total Price (৳)</Label>
            <Input id="book-total" type="number" placeholder="e.g. 9500000" {...register("totalPrice")} />
            {errors.totalPrice && <p className="text-sm text-destructive">{errors.totalPrice.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
