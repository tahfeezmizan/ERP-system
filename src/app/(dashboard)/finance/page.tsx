"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { useGetAccountsQuery, useCreateJournalEntryMutation } from "@/services/moduleApis";
import { createJournalEntrySchema, type CreateJournalEntryFormData } from "@/schemas";
import { formatBDT } from "@/lib/utils";

type Account = {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
};

const ACCOUNT_TYPES = ["Asset", "Liability", "Revenue", "Expense", "Equity"] as const;

export default function FinancePage() {
  const { data = [], isLoading, refetch } = useGetAccountsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createJournalEntry] = useCreateJournalEntryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateJournalEntryFormData>({
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues: {
      accountCode: "",
      accountName: "",
      type: "Asset",
      balance: undefined,
    },
  });

  const typeValue = watch("type");

  const columns: Column<Account>[] = [
    { key: "code", header: "Code", cell: (r) => r.code, sortable: true },
    { key: "name", header: "Account Name", cell: (r) => r.name, sortable: true },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "balance", header: "Balance", cell: (r) => formatBDT(r.balance), sortable: true },
  ];

  async function onSubmit(values: CreateJournalEntryFormData) {
    try {
      await createJournalEntry(values).unwrap();
      toast.success("Account entry created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to create account entry");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Accounts & Finance" description="General ledger, VAT, tax, and financial reports">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Journal Entry
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["code", "name", "type"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="New Journal Entry / Account"
        description="Add a new account or ledger entry"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="acc-code">Account Code</Label>
            <Input id="acc-code" placeholder="e.g. 1001" {...register("accountCode")} />
            {errors.accountCode && <p className="text-sm text-destructive">{errors.accountCode.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="acc-type">Account Type</Label>
            <Select
              value={typeValue}
              onValueChange={(v) => setValue("type", v as CreateJournalEntryFormData["type"])}
            >
              <SelectTrigger id="acc-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="acc-name">Account Name</Label>
            <Input id="acc-name" placeholder="e.g. Cash in Hand" {...register("accountName")} />
            {errors.accountName && <p className="text-sm text-destructive">{errors.accountName.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="acc-balance">Opening Balance (৳)</Label>
            <Input id="acc-balance" type="number" placeholder="e.g. 0" {...register("balance")} />
            {errors.balance && <p className="text-sm text-destructive">{errors.balance.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
