"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockBankAccounts, mockGeneralLedgerEntries } from "@/lib/mock-data";
import {
  useCreateChartAccountMutation,
  useCreateInvoiceMutation,
  useCreateTransactionMutation,
  useDeleteChartAccountMutation,
  useDeleteInvoiceMutation,
  useDeleteTransactionMutation,
  useGetChartOfAccountsQuery,
  useGetInvoicesQuery,
  useGetTransactionsQuery,
  useUpdateChartAccountMutation,
  useUpdateInvoiceMutation,
  useUpdateTransactionMutation,
} from "@/services/moduleApis";
import { Building2, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TabId = "overview" | "invoices" | "transactions" | "chart" | "ledger" | "banks";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "invoices", label: "Invoices" },
  { id: "transactions", label: "Transactions" },
  { id: "chart", label: "Chart of Accounts" },
  { id: "ledger", label: "General Ledger" },
  { id: "banks", label: "Bank Accounts" },
];

const INVOICE_STATUSES = ["unpaid", "paid", "overdue", "draft"] as const;
const TXN_TYPES = ["Credit", "Debit"] as const;
const TXN_STATUSES = ["cleared", "pending", "reconciled"] as const;
const ACCOUNT_TYPES = ["Asset", "Liability", "Revenue", "Expense", "Equity"] as const;
const ACCOUNT_SUBTYPES = ["Cash", "Receivable", "Payable", "Fixed Asset", "-"] as const;
const NORMAL_BALANCES = ["Debit", "Credit"] as const;

function KpiCard({ label, value, borderColor }: { label: string; value: string; borderColor: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" style={{ borderLeft: `4px solid ${borderColor}` }}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function InlineStatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const map: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-orange-100 text-orange-700",
    overdue: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-600",
    cleared: "text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
    reconciled: "bg-blue-100 text-blue-700",
    connected: "bg-teal-100 text-teal-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function ConfirmDeleteModal({ open, label, onCancel, onConfirm }: { open: boolean; label: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[min(95vw,400px)] rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <h2 className="text-base font-semibold text-gray-900">Delete {label}?</h2>
        <p className="mt-2 text-sm text-gray-500">This action cannot be undone. The record will be permanently removed.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: invoices = [], refetch: refetchInvoices } = useGetInvoicesQuery();
  const [createInvoice, { isLoading: creatingInvoice }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: updatingInvoice }] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; mode: "create" | "edit"; record?: any }>({ open: false, mode: "create" });
  const [invoiceForm, setInvoiceForm] = useState({ tenant: "", account: "", amount: "", date: "", dueDate: "", reference: "", notes: "", status: "unpaid" });
  const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<any>(null);

  const { data: transactions = [], refetch: refetchTransactions } = useGetTransactionsQuery();
  const [createTransaction, { isLoading: creatingTxn }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updatingTxn }] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [txnModal, setTxnModal] = useState<{ open: boolean; mode: "create" | "edit"; record?: any }>({ open: false, mode: "create" });
  const [txnForm, setTxnForm] = useState({ date: "", account: "", type: "Credit", amount: "", reference: "", memo: "", status: "cleared" });
  const [deleteTxnTarget, setDeleteTxnTarget] = useState<any>(null);

  const { data: chartAccounts = [], refetch: refetchChart } = useGetChartOfAccountsQuery();
  const [createChartAccount, { isLoading: creatingAcct }] = useCreateChartAccountMutation();
  const [updateChartAccount, { isLoading: updatingAcct }] = useUpdateChartAccountMutation();
  const [deleteChartAccount] = useDeleteChartAccountMutation();
  const [acctModal, setAcctModal] = useState<{ open: boolean; mode: "create" | "edit"; record?: any }>({ open: false, mode: "create" });
  const [acctForm, setAcctForm] = useState({ code: "", name: "", type: "Asset", subtype: "-", normalBalance: "Debit", description: "" });
  const [deleteAcctTarget, setDeleteAcctTarget] = useState<any>(null);

  const totalRevenue = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + i.amount, 0) || 45000;
  const totalExpenses = transactions.filter((t: any) => t.type === "Debit").reduce((s: number, t: any) => s + t.amount, 0) || 12500;
  const totalOutstanding = invoices.filter((i: any) => i.status === "unpaid").reduce((s: number, i: any) => s + i.amount, 0) || 10000;
  const netIncome = totalRevenue - totalExpenses;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const glEntries = mockGeneralLedgerEntries;
  const totalDebits = glEntries.reduce((s, e) => s + e.debit, 0);
  const totalCredits = glEntries.reduce((s, e) => s + e.credit, 0);
  const glBalanced = totalDebits === totalCredits;

  function openCreateInvoice() {
    setInvoiceForm({ tenant: "", account: "", amount: "", date: "", dueDate: "", reference: "", notes: "", status: "unpaid" });
    setInvoiceModal({ open: true, mode: "create" });
  }
  function openEditInvoice(row: any) {
    setInvoiceForm({ tenant: row.tenant, account: row.account, amount: String(row.amount), date: row.date, dueDate: row.dueDate, reference: row.reference, notes: row.notes, status: row.status });
    setInvoiceModal({ open: true, mode: "edit", record: row });
  }
  async function submitInvoice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...invoiceForm, amount: parseFloat(invoiceForm.amount) };
    try {
      if (invoiceModal.mode === "create") { await createInvoice(payload).unwrap(); toast.success("Invoice created"); }
      else { await updateInvoice({ id: invoiceModal.record.id, data: payload }).unwrap(); toast.success("Invoice updated"); }
      setInvoiceModal({ open: false, mode: "create" });
      void refetchInvoices();
    } catch { toast.error("Failed to save invoice"); }
  }
  async function confirmDeleteInvoice() {
    try { await deleteInvoice(deleteInvoiceTarget.id).unwrap(); toast.success("Invoice deleted"); setDeleteInvoiceTarget(null); void refetchInvoices(); }
    catch { toast.error("Failed to delete invoice"); }
  }

  function openCreateTxn() {
    setTxnForm({ date: "", account: "", type: "Credit", amount: "", reference: "", memo: "", status: "cleared" });
    setTxnModal({ open: true, mode: "create" });
  }
  function openEditTxn(row: any) {
    setTxnForm({ date: row.date, account: row.account, type: row.type, amount: String(row.amount), reference: row.reference, memo: row.memo, status: row.status });
    setTxnModal({ open: true, mode: "edit", record: row });
  }
  async function submitTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...txnForm, amount: parseFloat(txnForm.amount) };
    try {
      if (txnModal.mode === "create") { await createTransaction(payload).unwrap(); toast.success("Transaction recorded"); }
      else { await updateTransaction({ id: txnModal.record.id, data: payload }).unwrap(); toast.success("Transaction updated"); }
      setTxnModal({ open: false, mode: "create" });
      void refetchTransactions();
    } catch { toast.error("Failed to save transaction"); }
  }
  async function confirmDeleteTxn() {
    try { await deleteTransaction(deleteTxnTarget.id).unwrap(); toast.success("Transaction deleted"); setDeleteTxnTarget(null); void refetchTransactions(); }
    catch { toast.error("Failed to delete transaction"); }
  }

  function openCreateAcct() {
    setAcctForm({ code: "", name: "", type: "Asset", subtype: "-", normalBalance: "Debit", description: "" });
    setAcctModal({ open: true, mode: "create" });
  }
  function openEditAcct(row: any) {
    setAcctForm({ code: row.code, name: row.name, type: row.type, subtype: row.subtype ?? "-", normalBalance: row.normalBalance, description: row.description ?? "" });
    setAcctModal({ open: true, mode: "edit", record: row });
  }
  async function submitAcct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (acctModal.mode === "create") { await createChartAccount(acctForm).unwrap(); toast.success("Account added"); }
      else { await updateChartAccount({ id: acctModal.record.id, data: acctForm }).unwrap(); toast.success("Account updated"); }
      setAcctModal({ open: false, mode: "create" });
      void refetchChart();
    } catch { toast.error("Failed to save account"); }
  }
  async function confirmDeleteAcct() {
    try { await deleteChartAccount(deleteAcctTarget.id).unwrap(); toast.success("Account deleted"); setDeleteAcctTarget(null); void refetchChart(); }
    catch { toast.error("Failed to delete account"); }
  }

  const headerAction =
    activeTab === "invoices" ? (
      <Button id="btn-create-invoice" className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700" onClick={openCreateInvoice}>
        <Plus className="h-4 w-4" /> Create Invoice
      </Button>
    ) : activeTab === "transactions" ? (
      <Button id="btn-record-transaction" className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700" onClick={openCreateTxn}>
        <Plus className="h-4 w-4" /> Record Transaction
      </Button>
    ) : activeTab === "chart" ? (
      <Button id="btn-add-account" className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700" onClick={openCreateAcct}>
        <Plus className="h-4 w-4" /> Add Account
      </Button>
    ) : null;

  const thCls = "px-4 py-3 text-left text-sm font-semibold text-gray-700";
  const tdCls = "px-4 py-3 text-sm text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="mt-0.5 text-sm text-gray-500">Accounting, invoicing, and reporting</p>
        </div>
        {headerAction}
      </div>

      <div className="px-6 space-y-6 pb-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Revenue" value={fmt(totalRevenue)} borderColor="#22c55e" />
          <KpiCard label="Total Expenses" value={fmt(totalExpenses)} borderColor="#ef4444" />
          <KpiCard label="Net Operating Income" value={fmt(netIncome)} borderColor="#3b82f6" />
          <KpiCard label="Outstanding Invoices" value={fmt(totalOutstanding)} borderColor="#f97316" />
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4"><h2 className="text-base font-semibold text-gray-900">Recent Invoices</h2></div>
              <table className="w-full">
                <thead className="border-t border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>#</th>
                    <th className={thCls}>Tenant</th>
                    <th className={thCls}>Amount</th>
                    <th className={thCls}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map((inv: any) => (
                    <tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className={tdCls + " font-mono text-xs"}>{inv.invoiceNo}</td>
                      <td className={tdCls}>{inv.tenant}</td>
                      <td className={tdCls}>${inv.amount.toLocaleString()}</td>
                      <td className={tdCls}><InlineStatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4"><h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2></div>
              <table className="w-full">
                <thead className="border-t border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>#</th>
                    <th className={thCls}>Date</th>
                    <th className={thCls}>Type</th>
                    <th className={thCls}>Amount</th>
                    <th className={thCls}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((txn: any) => (
                    <tr key={txn.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className={tdCls + " font-mono text-xs"}>{txn.txnNo}</td>
                      <td className={tdCls}>{txn.date}</td>
                      <td className={tdCls}>{txn.type}</td>
                      <td className={tdCls}>${txn.amount.toLocaleString()}</td>
                      <td className={tdCls}><InlineStatusBadge status={txn.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>#</th>
                  <th className={thCls}>Tenant</th>
                  <th className={thCls}>Date</th>
                  <th className={thCls}>Due Date</th>
                  <th className={thCls}>Amount</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">No invoices yet. Click &quot;Create Invoice&quot; to add one.</td></tr>
                )}
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className={tdCls + " font-mono text-xs"}>{inv.invoiceNo}</td>
                    <td className={tdCls}>{inv.tenant}</td>
                    <td className={tdCls}>{inv.date}</td>
                    <td className={tdCls}>{inv.dueDate}</td>
                    <td className={tdCls}>${inv.amount.toLocaleString()}</td>
                    <td className={tdCls}><InlineStatusBadge status={inv.status} /></td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <button id={`edit-inv-${inv.id}`} onClick={() => openEditInvoice(inv)} className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button id={`del-inv-${inv.id}`} onClick={() => setDeleteInvoiceTarget(inv)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>#</th>
                  <th className={thCls}>Date</th>
                  <th className={thCls}>Account</th>
                  <th className={thCls}>Type</th>
                  <th className={thCls}>Amount</th>
                  <th className={thCls}>Reference</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">No transactions yet. Click &quot;Record Transaction&quot; to add one.</td></tr>
                )}
                {transactions.map((txn: any) => (
                  <tr key={txn.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className={tdCls + " font-mono text-xs"}>{txn.txnNo}</td>
                    <td className={tdCls}>{txn.date}</td>
                    <td className={tdCls}>{txn.account}</td>
                    <td className={tdCls}>{txn.type}</td>
                    <td className={tdCls}>${txn.amount.toLocaleString()}</td>
                    <td className={tdCls + " font-mono text-xs"}>{txn.reference}</td>
                    <td className={tdCls}><InlineStatusBadge status={txn.status} /></td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <button id={`edit-txn-${txn.id}`} onClick={() => openEditTxn(txn)} className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button id={`del-txn-${txn.id}`} onClick={() => setDeleteTxnTarget(txn)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "chart" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>Code</th>
                  <th className={thCls}>Account Name</th>
                  <th className={thCls}>Type</th>
                  <th className={thCls}>Subtype</th>
                  <th className={thCls}>Normal Balance</th>
                  <th className={thCls}>Active</th>
                  <th className={thCls}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chartAccounts.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">No accounts yet. Click &quot;Add Account&quot; to get started.</td></tr>
                )}
                {chartAccounts.map((acct: any) => (
                  <tr key={acct.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className={tdCls + " font-mono text-sm font-semibold"}>{acct.code}</td>
                    <td className={tdCls}>{acct.name}</td>
                    <td className={tdCls}>{acct.type}</td>
                    <td className={tdCls}>{acct.subtype ?? "-"}</td>
                    <td className={tdCls}>{acct.normalBalance}</td>
                    <td className={tdCls}>{acct.active ? "Yes" : "No"}</td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <button id={`edit-coa-${acct.id}`} onClick={() => openEditAcct(acct)} className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button id={`del-coa-${acct.id}`} onClick={() => setDeleteAcctTarget(acct)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "ledger" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Debits</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${totalDebits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Credits</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${totalCredits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className={`rounded-xl border p-5 shadow-sm ${glBalanced ? "border-teal-200 bg-teal-50" : "border-red-200 bg-red-50"}`}>
                <p className={`text-sm font-semibold ${glBalanced ? "text-teal-700" : "text-red-700"}`}>Ledger Balance Status</p>
                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle2 className={`h-5 w-5 ${glBalanced ? "text-teal-600" : "text-red-600"}`} />
                  <p className={`text-base font-bold ${glBalanced ? "text-teal-700" : "text-red-700"}`}>
                    {glBalanced ? "Balanced ($0.00 Difference)" : `Unbalanced ($${Math.abs(totalDebits - totalCredits).toFixed(2)} Diff)`}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Double-Entry Journal Ledger</h2>
                <p className="text-xs text-gray-400 mt-0.5">All recorded ledger postings for the current physical period</p>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className={thCls}>Post Date</th>
                    <th className={thCls}>Code</th>
                    <th className={thCls}>Account</th>
                    <th className={thCls}>Memo / Reference</th>
                    <th className={thCls + " text-right"}>Debit ($)</th>
                    <th className={thCls + " text-right"}>Credit ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {glEntries.map((entry) => (
                    <tr key={entry.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className={tdCls}>{entry.postDate}</td>
                      <td className={tdCls + " font-mono text-xs"}>{entry.code}</td>
                      <td className={tdCls}>{entry.account}</td>
                      <td className={tdCls + " text-xs text-gray-500"}>{entry.memo} — {entry.reference}</td>
                      <td className={tdCls + " text-right"}>{entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : "—"}</td>
                      <td className={tdCls + " text-right"}>{entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Totals</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">${totalDebits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">${totalCredits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === "banks" && (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {mockBankAccounts.map((bank) => (
                <div key={bank.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{bank.name}</p>
                        <p className="text-sm text-gray-500">{bank.bank}</p>
                      </div>
                    </div>
                    <InlineStatusBadge status={bank.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Account Number:</p>
                      <p className="font-mono font-medium text-gray-700">···· {bank.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Routing Number:</p>
                      <p className="font-mono font-medium text-gray-700">{bank.routingNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-500">Available Balance:</p>
                    <p className="text-lg font-bold text-gray-900">${bank.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Connected Bank Statement Importer</p>
                  <p className="text-xs text-gray-400 mt-0.5">Automatically syncs transactions from connected bank accounts</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button variant="outline" className="text-sm">Import Statement (CSV)</Button>
                <Button variant="outline" className="text-sm">Sync Now</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <EntityCreateModal
        open={invoiceModal.open}
        onOpenChange={(v) => setInvoiceModal((p) => ({ ...p, open: v }))}
        title={invoiceModal.mode === "create" ? "Create Invoice" : "Edit Invoice"}
        description={invoiceModal.mode === "create" ? "Add a new invoice for a tenant" : "Update the invoice details"}
        submitLabel={invoiceModal.mode === "create" ? "Create Invoice" : "Save Changes"}
        isLoading={creatingInvoice || updatingInvoice}
        onSubmit={submitInvoice}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="inv-tenant">Tenant / Client</Label>
            <Input id="inv-tenant" placeholder="e.g. Acme Corporation" value={invoiceForm.tenant} onChange={(e) => setInvoiceForm((p) => ({ ...p, tenant: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-account">Account</Label>
            <Input id="inv-account" placeholder="e.g. Operating Account" value={invoiceForm.account} onChange={(e) => setInvoiceForm((p) => ({ ...p, account: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-amount">Amount ($)</Label>
            <Input id="inv-amount" type="number" placeholder="e.g. 12000" value={invoiceForm.amount} onChange={(e) => setInvoiceForm((p) => ({ ...p, amount: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-status">Status</Label>
            <Select value={invoiceForm.status} onValueChange={(v) => setInvoiceForm((p) => ({ ...p, status: v }))}>
              <SelectTrigger id="inv-status"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>{INVOICE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-date">Invoice Date</Label>
            <Input id="inv-date" type="date" value={invoiceForm.date} onChange={(e) => setInvoiceForm((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-due">Due Date</Label>
            <Input id="inv-due" type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm((p) => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-ref">Reference</Label>
            <Input id="inv-ref" placeholder="e.g. ACH-ACME-RENT" value={invoiceForm.reference} onChange={(e) => setInvoiceForm((p) => ({ ...p, reference: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-notes">Notes</Label>
            <Input id="inv-notes" placeholder="e.g. May 2026 rent" value={invoiceForm.notes} onChange={(e) => setInvoiceForm((p) => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </EntityCreateModal>

      {/* Transaction Modal */}
      <EntityCreateModal
        open={txnModal.open}
        onOpenChange={(v) => setTxnModal((p) => ({ ...p, open: v }))}
        title={txnModal.mode === "create" ? "Record Transaction" : "Edit Transaction"}
        description={txnModal.mode === "create" ? "Record a new financial transaction" : "Update transaction details"}
        submitLabel={txnModal.mode === "create" ? "Record Transaction" : "Save Changes"}
        isLoading={creatingTxn || updatingTxn}
        onSubmit={submitTxn}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="txn-date">Date</Label>
            <Input id="txn-date" type="date" value={txnForm.date} onChange={(e) => setTxnForm((p) => ({ ...p, date: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="txn-account">Account</Label>
            <Input id="txn-account" placeholder="e.g. Operating Account" value={txnForm.account} onChange={(e) => setTxnForm((p) => ({ ...p, account: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="txn-type">Type</Label>
            <Select value={txnForm.type} onValueChange={(v) => setTxnForm((p) => ({ ...p, type: v }))}>
              <SelectTrigger id="txn-type"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{TXN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="txn-amount">Amount ($)</Label>
            <Input id="txn-amount" type="number" placeholder="e.g. 12000" value={txnForm.amount} onChange={(e) => setTxnForm((p) => ({ ...p, amount: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="txn-ref">Reference</Label>
            <Input id="txn-ref" placeholder="e.g. ACH-ACME-RENT" value={txnForm.reference} onChange={(e) => setTxnForm((p) => ({ ...p, reference: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="txn-status">Status</Label>
            <Select value={txnForm.status} onValueChange={(v) => setTxnForm((p) => ({ ...p, status: v }))}>
              <SelectTrigger id="txn-status"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>{TXN_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="txn-memo">Memo</Label>
            <Input id="txn-memo" placeholder="e.g. Acme Corp rent payment" value={txnForm.memo} onChange={(e) => setTxnForm((p) => ({ ...p, memo: e.target.value }))} />
          </div>
        </div>
      </EntityCreateModal>

      {/* Chart of Accounts Modal */}
      <EntityCreateModal
        open={acctModal.open}
        onOpenChange={(v) => setAcctModal((p) => ({ ...p, open: v }))}
        title={acctModal.mode === "create" ? "Add Account" : "Edit Account"}
        description={acctModal.mode === "create" ? "Add a new account to the chart of accounts" : "Update account details"}
        submitLabel={acctModal.mode === "create" ? "Add Account" : "Save Changes"}
        isLoading={creatingAcct || updatingAcct}
        onSubmit={submitAcct}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="coa-code">Account Code</Label>
            <Input id="coa-code" placeholder="e.g. 1010" value={acctForm.code} onChange={(e) => setAcctForm((p) => ({ ...p, code: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coa-type">Account Type</Label>
            <Select value={acctForm.type} onValueChange={(v) => setAcctForm((p) => ({ ...p, type: v }))}>
              <SelectTrigger id="coa-type"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{ACCOUNT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="coa-name">Account Name</Label>
            <Input id="coa-name" placeholder="e.g. Operating Account" value={acctForm.name} onChange={(e) => setAcctForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coa-subtype">Subtype</Label>
            <Select value={acctForm.subtype} onValueChange={(v) => setAcctForm((p) => ({ ...p, subtype: v }))}>
              <SelectTrigger id="coa-subtype"><SelectValue placeholder="Select subtype" /></SelectTrigger>
              <SelectContent>{ACCOUNT_SUBTYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coa-normal">Normal Balance</Label>
            <Select value={acctForm.normalBalance} onValueChange={(v) => setAcctForm((p) => ({ ...p, normalBalance: v }))}>
              <SelectTrigger id="coa-normal"><SelectValue placeholder="Select balance" /></SelectTrigger>
              <SelectContent>{NORMAL_BALANCES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="coa-desc">Description</Label>
            <Input id="coa-desc" placeholder="e.g. Primary operating bank account" value={acctForm.description} onChange={(e) => setAcctForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
      </EntityCreateModal>

      {/* Delete Confirm Modals */}
      <ConfirmDeleteModal open={!!deleteInvoiceTarget} label="Invoice" onCancel={() => setDeleteInvoiceTarget(null)} onConfirm={confirmDeleteInvoice} />
      <ConfirmDeleteModal open={!!deleteTxnTarget} label="Transaction" onCancel={() => setDeleteTxnTarget(null)} onConfirm={confirmDeleteTxn} />
      <ConfirmDeleteModal open={!!deleteAcctTarget} label="Account" onCancel={() => setDeleteAcctTarget(null)} onConfirm={confirmDeleteAcct} />
    </div>
  );
}

