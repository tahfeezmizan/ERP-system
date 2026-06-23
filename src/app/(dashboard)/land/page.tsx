"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { formatBDT, formatNumber } from "@/lib/utils";
import {
  useDeleteLandRecordMutation,
  useGetLandRecordsQuery,
} from "@/services/moduleApis";
import type { LandRecord } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LandPage() {
  const router = useRouter();
  const { data = [], isLoading } = useGetLandRecordsQuery();
  const [deleteLandRecord] = useDeleteLandRecordMutation();

  async function handleDelete(row: LandRecord) {
    const label = row.landId || row.mouza || row.id;
    if (!window.confirm(`Delete land record "${label}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteLandRecord(row.id).unwrap();
      toast.success("Land record deleted");
    } catch {
      toast.error("Failed to delete land record");
    }
  }

  function handleEdit(row: LandRecord) {
    router.push(`/land/create-land?id=${row.id}`);
  }


  const columns: Column<LandRecord>[] = [
    { key: "landId", header: "Land ID", cell: (r) => r.landId || "-", sortable: true },
    { key: "recordType", header: "Record Type", cell: (r) => r.recordType || "-", sortable: true },

    { key: "district", header: "District", cell: (r) => r.district || "-", sortable: true },
    { key: "upazila", header: "Upazila/Thana", cell: (r) => r.upazila || "-", sortable: true },

    { key: "jlNo", header: "JL No.", cell: (r) => r.jlNo || "-", sortable: true },

    { key: "mouza", header: "Mouza", cell: (r) => r.mouza, sortable: true },
    { key: "khatian", header: "Khatian", cell: (r) => r.khatian, sortable: true },
    { key: "dag", header: "Dag", cell: (r) => r.dag, sortable: true },

    { key: "csRecord", header: "CS Record", cell: (r) => r.csRecord || "-", sortable: true },
    { key: "rsRecord", header: "RS Record", cell: (r) => r.rsRecord || "-", sortable: true },

    { key: "landType", header: "Land Type", cell: (r) => r.landType || "-", sortable: true },

    {
      key: "sharePercent",
      header: "Share (%)",
      cell: (r) => (r.sharePercent ? `${r.sharePercent}%` : "-"),
      sortable: true,
    },

    {
      key: "acquisitionType",
      header: "Acquisition Type",
      cell: (r) => r.acquisitionType || "-",
      sortable: true,
    },

    {
      key: "acquisitionDate",
      header: "Acquisition Date",
      cell: (r) => r.acquisitionDate || "-",
      sortable: true,
    },

    {
      key: "mutationStatus",
      header: "Mutation Status",
      cell: (r) => r.mutationStatus || "-",
      sortable: true,
    },

    {
      key: "developmentAgreementStatus",
      header: "Development Agreement",
      cell: (r) => r.developmentAgreementStatus || "-",
      sortable: true,
    },

    {
      key: "totalOwners",
      header: "Total Owners",
      cell: (r) => r.totalOwners ?? r.owners?.length ?? 0,
      sortable: true,
    },

    {
      key: "availableArea",
      header: "Available Area",
      cell: (r) => (r.availableArea ? formatNumber(r.availableArea) : "-"),
      sortable: true,
    },

    {
      key: "area",
      header: "Area (Katha)",
      cell: (r) => formatNumber(r.area),
      sortable: true,
    },

    {
      key: "valuation",
      header: "Valuation",
      cell: (r) => formatBDT(r.valuation),
      sortable: true,
    },

    {
      key: "estimatedProjectYield",
      header: "Est. Project Yield",
      cell: (r) => r.estimatedProjectYield || "-",
      sortable: true,
    },

    {
      key: "documentsStatus",
      header: "Documents Status",
      cell: (r) => r.documentsStatus || "-",
      sortable: true,
    },

    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} />,
    },

    {
      key: "lastUpdated",
      header: "Last Updated",
      cell: (r) => r.lastUpdated || "-",
      sortable: true,
    },

    {
      key: "owners",
      header: "Owners",
      cell: (r) => r.owners.length,
      sortable: true,
    },
  ];


  return (
    <div className="space-y-6">
      <PageHeader title="Land Management" description="Land acquisition, owners, and Bangladesh land records">
        <Button asChild>
          <Link href="/land/create-land">
            <Plus className="h-4 w-4 mr-1" /> Add Land Record
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKeys={["mouza", "khatian", "dag"]}
        onRowEdit={handleEdit}
        onRowDelete={handleDelete}
      />
    </div>
  );
}