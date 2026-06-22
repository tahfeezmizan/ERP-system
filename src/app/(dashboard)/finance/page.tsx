"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useGetAccountsQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";

type Account = {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
};

export default function FinancePage() {
  const { data = [], isLoading } = useGetAccountsQuery();

  const columns: Column<Account>[] = [
    { key: "code", header: "Code", cell: (r) => r.code, sortable: true },
    { key: "name", header: "Account Name", cell: (r) => r.name, sortable: true },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "balance", header: "Balance", cell: (r) => formatBDT(r.balance), sortable: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Accounts & Finance" description="General ledger, VAT, tax, and financial reports">
        <Button><Plus className="h-4 w-4 mr-1" /> Journal Entry</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["code", "name", "type"]} />
    </div>
  );
}
