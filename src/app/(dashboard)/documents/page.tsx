"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
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
import { createDocumentSchema, type CreateDocumentFormData } from "@/schemas";
import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} from "@/services/moduleApis";
import type { Document } from "@/types";
import { 
  Plus, 
  Search, 
  FileUp, 
  FileText, 
  X, 
  AlertTriangle, 
  Check, 
  FileCode, 
  FileImage, 
  FileSpreadsheet,
  Calendar,
  Lock,
  Unlock
} from "lucide-react";
import { useMemo, useState, useRef } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { value: "Lease", label: "Lease" },
  { value: "Building_plan", label: "Building Plan" },
  { value: "Agreement", label: "Agreement" },
  { value: "NID", label: "NID/Passport" },
  { value: "Tax", label: "Tax Document" },
  { value: "Other", label: "Other" },
] as const;

const defaultFormValues: CreateDocumentFormData = {
  title: "",
  category: "",
  fileName: "",
  fileSize: "0.0 B",
  version: "v1",
  expiresAt: "Never",
  isConfidential: false,
};

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useGetDocumentsQuery();
  const [createDocument] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Delete confirmation state
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null);

  // File upload drag state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentSchema) as Resolver<CreateDocumentFormData>,
    defaultValues: defaultFormValues,
  });

  const categoryValue = watch("category");
  const isConfidentialValue = watch("isConfidential");
  const expiresAtValue = watch("expiresAt");
  const fileNameValue = watch("fileName");
  const fileSizeValue = watch("fileSize");

  // Determine if expiresAt is "Never" or a specific date
  const isExpiresNever = expiresAtValue === "Never" || !expiresAtValue;

  // Filter documents by category and search query
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory =
        categoryFilter === "All" || doc.category === categoryFilter;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, categoryFilter, searchQuery]);

  // File type icon selector
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return <FileText className="h-8 w-8 text-blue-500" />;
    
    if (["pdf"].includes(ext)) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600"><FileText className="h-6 w-6" /></div>;
    }
    if (["dwg", "dxf", "cad"].includes(ext)) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600"><FileCode className="h-6 w-6" /></div>;
    }
    if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"><FileImage className="h-6 w-6" /></div>;
    }
    if (["xls", "xlsx", "csv"].includes(ext)) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><FileSpreadsheet className="h-6 w-6" /></div>;
    }
    return <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><FileText className="h-6 w-6" /></div>;
  };

  // Human readable file size formatter
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0.0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const cleanTitle = nameWithoutExt
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    setValue("fileName", file.name);
    setValue("fileSize", formatBytes(file.size));
    
    // Only overwrite title if it is currently empty or matches a default placeholder
    const currentTitle = watch("title");
    if (!currentTitle || currentTitle.trim() === "") {
      setValue("title", cleanTitle);
    }

    toast.success(`File "${file.name}" loaded successfully.`);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setValue("fileName", "");
    setValue("fileSize", "0.0 B");
  };

  // DataTable columns configuration
  const columns: Column<Document>[] = [
    {
      key: "title",
      header: "Title",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.title}</span>
          <span className="text-xs text-muted-foreground sm:hidden mt-0.5">{row.fileName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => {
        const cat = CATEGORY_OPTIONS.find((opt) => opt.value === row.category);
        return <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">{cat ? cat.label : row.category}</span>;
      },
      sortable: true,
    },
    {
      key: "fileName",
      header: "File",
      cell: (row) => (
        <span className="font-mono text-xs text-muted-foreground hover:text-foreground transition truncate max-w-[180px] block">
          {row.fileName}
        </span>
      ),
      sortable: true,
    },
    {
      key: "fileSize",
      header: "Size",
      cell: (row) => <span className="text-muted-foreground text-sm">{row.fileSize}</span>,
      sortable: true,
    },
    {
      key: "version",
      header: "Ver",
      cell: (row) => <span className="font-medium text-xs text-muted-foreground">{row.version}</span>,
      sortable: true,
    },
    {
      key: "expiresAt",
      header: "Expires",
      cell: (row) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{row.expiresAt}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "isConfidential",
      header: "Confidential",
      cell: (row) => (
        <div className="flex items-center gap-1">
          {row.isConfidential ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
              <Lock className="h-3 w-3" /> Yes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
              <Unlock className="h-3 w-3" /> No
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  // Open modal for creating a new document
  const handleOpenCreateModal = () => {
    setEditingDocument(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  };

  // Open modal for editing a document
  const handleOpenEditModal = (doc: Document) => {
    setEditingDocument(doc);
    reset({
      title: doc.title,
      category: doc.category,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      version: doc.version,
      expiresAt: doc.expiresAt,
      isConfidential: doc.isConfidential,
    });
    setIsModalOpen(true);
  };

  // Form submission handler
  const onSubmit = async (data: CreateDocumentFormData) => {
    try {
      if (editingDocument) {
        await updateDocument({ id: editingDocument.id, data }).unwrap();
        toast.success("Document updated successfully.");
      } else {
        await createDocument(data).unwrap();
        toast.success("Document added successfully.");
      }
      setIsModalOpen(false);
      reset(defaultFormValues);
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("An error occurred while saving the document.");
    }
  };

  // Trigger delete request
  const handleDeleteConfirm = async () => {
    if (!deletingDoc) return;
    try {
      await deleteDocument(deletingDoc.id).unwrap();
      toast.success(`Document "${deletingDoc.title}" deleted successfully.`);
      setDeletingDoc(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete the document.");
    }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <PageHeader
        title="Documents"
        description="Document repository and version control"
      >
        <Button
          onClick={handleOpenCreateModal}
          className="bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm font-medium flex items-center gap-1 rounded-lg px-4 py-2 transition dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" /> Add Document
        </Button>
      </PageHeader>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
        
        {/* Custom DataTable Toolbar Integration */}
        <DataTable
          columns={columns}
          data={filteredDocuments}
          isLoading={isLoading}
          searchPlaceholder="Search..."
          searchKeys={["title", "fileName", "category"]}
          pageSize={10}
          hideExportPrint={true}
          onRowEdit={handleOpenEditModal}
          onRowDelete={(row) => setDeletingDoc(row)}
          emptyMessage="No documents found matching the filters."
          toolbarExtra={
            <div className="w-full sm:w-48">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />
      </div>

      {/* Add / Edit Modal */}
      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingDocument ? "Edit Document" : "Add Document"}
        description={
          editingDocument
            ? "Update the details of this document."
            : "Upload a new file or specify details to register a document in the repository."
        }
        submitLabel={editingDocument ? "Update Document" : "Add Document"}
        isLoading={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-5 py-2">
          
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Document File</Label>
            
            {fileNameValue ? (
              // Uploaded File Info Card
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 transition">
                <div className="flex items-center gap-3 min-w-0">
                  {getFileIcon(fileNameValue)}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-50">{fileNameValue}</p>
                    <p className="text-xs text-muted-foreground">{fileSizeValue}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Drag and drop dropzone
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/10"
                    : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/20 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/10"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 mb-3">
                  <FileUp className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Drag and drop your file here, or <span className="text-blue-600 hover:underline dark:text-blue-400">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Supports PDF, DOCX, DWG, PNG, JPG up to 50MB
                </p>
              </div>
            )}
            
            <input
              type="hidden"
              {...register("fileName")}
            />
            <input
              type="hidden"
              {...register("fileSize")}
            />
            
            {errors.fileName && (
              <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> File attachment is required
              </p>
            )}
          </div>

          {/* Document Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
            <Input
              id="title"
              placeholder="e.g. Standard Commercial Lease Agreement"
              className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Grid for Category, Version & Expiration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Category Select */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={categoryValue}
                onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
              >
                <SelectTrigger className="rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> {errors.category.message}
                </p>
              )}
            </div>

            {/* Version Input */}
            <div className="space-y-1.5">
              <Label htmlFor="version" className="text-sm font-medium">Version</Label>
              <Input
                id="version"
                placeholder="e.g. v1"
                className="rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                {...register("version")}
              />
              {errors.version && (
                <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> {errors.version.message}
                </p>
              )}
            </div>
          </div>

          {/* Expiration & Confidentiality controls */}
          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/20 space-y-4">
            
            {/* Expiration field */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Expiration Date</Label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                  <input
                    type="radio"
                    name="expirationToggle"
                    checked={isExpiresNever}
                    onChange={() => setValue("expiresAt", "Never")}
                    className="h-4 w-4 rounded-full border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Never Expires</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                  <input
                    type="radio"
                    name="expirationToggle"
                    checked={!isExpiresNever}
                    onChange={() => setValue("expiresAt", new Date().toISOString().split("T")[0])}
                    className="h-4 w-4 rounded-full border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Select Date</span>
                </label>
              </div>

              {!isExpiresNever && (
                <div className="mt-2 relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10 rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                    value={expiresAtValue === "Never" ? "" : expiresAtValue}
                    onChange={(e) => setValue("expiresAt", e.target.value || "Never")}
                  />
                </div>
              )}
            </div>

            {/* Confidentiality toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <Label htmlFor="isConfidential" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-amber-500" /> Confidential Document
                </Label>
                <p className="text-xs text-muted-foreground">Restrict document viewing to authorized personnel only.</p>
              </div>
              <input
                id="isConfidential"
                type="checkbox"
                className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={isConfidentialValue}
                onChange={(e) => setValue("isConfidential", e.target.checked)}
              />
            </div>
          </div>

        </div>
      </EntityCreateModal>

      {/* Delete Confirmation Overlay Dialog */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setDeletingDoc(null)}
          />
          
          {/* Dialog Container */}
          <div className="relative z-50 w-full max-w-md scale-100 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Delete Document</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">"{deletingDoc.title}"</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-zinc-200 dark:border-zinc-800"
                onClick={() => setDeletingDoc(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={handleDeleteConfirm}
              >
                Delete Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}