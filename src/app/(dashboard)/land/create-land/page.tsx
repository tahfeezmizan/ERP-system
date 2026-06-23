"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLandRecordSchema, type CreateLandRecordFormData } from "@/schemas";
import { useCreateLandRecordMutation, useGetLandRecordsQuery } from "@/services/moduleApis";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

export default function CreateLandPage() {
    const router = useRouter();
    const { refetch } = useGetLandRecordsQuery();
    const [createLandRecord] = useCreateLandRecordMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateLandRecordFormData>({
        resolver: zodResolver(createLandRecordSchema) as any,
        defaultValues: {
            mouza: "",
            khatian: "",
            dag: "",
            area: undefined,
            valuation: undefined,
            status: "Pending",
            csRecord: "",
            rsRecord: "",
            landId: "",
            recordType: undefined,
            district: "",
            upazila: "",
            jlNo: "",
            landType: undefined,
            sharePercent: undefined,
            acquisitionType: undefined,
            acquisitionDate: "",
            mutationStatus: undefined,
            developmentAgreementStatus: undefined,
            totalOwners: undefined,
            availableArea: undefined,
            estimatedProjectYield: "",
            documentsStatus: undefined,
            lastUpdated: "",
        },
    });

    const statusValue = watch("status");

    function onInvalid(formErrors: FieldErrors<CreateLandRecordFormData>) {
        console.log("Validation errors:", formErrors);
        toast.error("Please fix the highlighted errors before saving");
    }

    async function onSubmit(values: CreateLandRecordFormData) {
        console.log("Submitting land record:", values);
        try {
            const res = await createLandRecord(values).unwrap();
            console.log("Created land record:", res);
            toast.success("Land record created successfully");
            void refetch();
            router.push("/land");
        } catch (error) {
            console.error("Failed to create land record:", error);
            toast.error("Failed to create land record");
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push("/land")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Land Record</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter Bangladesh land registry details
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/land")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmit, onInvalid)}
                        disabled={isSubmitting}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Record"}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6 border p-4 rounded-lg">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Land ID */}
                    <div className="grid gap-2">
                        <Label htmlFor="landId">Land ID</Label>
                        <Input id="landId" placeholder="e.g. LAND-001" {...register("landId")} />
                        {errors.landId && <p className="text-sm text-destructive">{errors.landId.message}</p>}
                    </div>

                    {/* Record Type */}
                    <div className="grid gap-2">
                        <Label htmlFor="recordType">Record Type</Label>
                        <Select
                            value={watch("recordType")}
                            onValueChange={(v) => setValue("recordType", v as CreateLandRecordFormData["recordType"], { shouldValidate: true })}
                        >
                            <SelectTrigger id="recordType">
                                <SelectValue placeholder="Select record type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CS">CS</SelectItem>
                                <SelectItem value="RS">RS</SelectItem>
                                <SelectItem value="SA">SA</SelectItem>
                                <SelectItem value="BRS">BRS</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.recordType && <p className="text-sm text-destructive">{errors.recordType.message}</p>}
                    </div>

                    {/* District */}
                    <div className="grid gap-2">
                        <Label htmlFor="district">District</Label>
                        <Input id="district" placeholder="e.g. Dhaka" {...register("district")} />
                        {errors.district && <p className="text-sm text-destructive">{errors.district.message}</p>}
                    </div>

                    {/* Upazila/Thana */}
                    <div className="grid gap-2">
                        <Label htmlFor="upazila">Upazila/Thana</Label>
                        <Input id="upazila" placeholder="e.g. Uttara" {...register("upazila")} />
                        {errors.upazila && <p className="text-sm text-destructive">{errors.upazila.message}</p>}
                    </div>

                    {/* JL No. */}
                    <div className="grid gap-2">
                        <Label htmlFor="jlNo">JL No.</Label>
                        <Input id="jlNo" placeholder="e.g. 125" {...register("jlNo")} />
                        {errors.jlNo && <p className="text-sm text-destructive">{errors.jlNo.message}</p>}
                    </div>

                    {/* Mouza */}
                    <div className="grid gap-2">
                        <Label htmlFor="mouza">Mouza *</Label>
                        <Input id="mouza" placeholder="e.g. Uttara" {...register("mouza")} />
                        {errors.mouza && <p className="text-sm text-destructive">{errors.mouza.message}</p>}
                    </div>

                    {/* Khatian No. */}
                    <div className="grid gap-2">
                        <Label htmlFor="khatian">Khatian No. *</Label>
                        <Input id="khatian" placeholder="e.g. 125" {...register("khatian")} />
                        {errors.khatian && <p className="text-sm text-destructive">{errors.khatian.message}</p>}
                    </div>

                    {/* Dag No. */}
                    <div className="grid gap-2">
                        <Label htmlFor="dag">Dag No. *</Label>
                        <Input id="dag" placeholder="e.g. 456" {...register("dag")} />
                        {errors.dag && <p className="text-sm text-destructive">{errors.dag.message}</p>}
                    </div>

                    {/* CS Record */}
                    <div className="grid gap-2">
                        <Label htmlFor="csRecord">CS Record</Label>
                        <Input id="csRecord" placeholder="e.g. CS-125/456" {...register("csRecord")} />
                        {errors.csRecord && <p className="text-sm text-destructive">{errors.csRecord.message}</p>}
                    </div>

                    {/* RS Record */}
                    <div className="grid gap-2">
                        <Label htmlFor="rsRecord">RS Record</Label>
                        <Input id="rsRecord" placeholder="e.g. RS-125/456" {...register("rsRecord")} />
                        {errors.rsRecord && <p className="text-sm text-destructive">{errors.rsRecord.message}</p>}
                    </div>

                    {/* Land Type */}
                    <div className="grid gap-2">
                        <Label htmlFor="landType">Land Type</Label>
                        <Select
                            value={watch("landType")}
                            onValueChange={(v) => setValue("landType", v as CreateLandRecordFormData["landType"])}
                        >
                            <SelectTrigger id="landType">
                                <SelectValue placeholder="Select land type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Agricultural">Agricultural</SelectItem>
                                <SelectItem value="Residential">Residential</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Industrial">Industrial</SelectItem>
                                <SelectItem value="Mixed">Mixed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.landType && <p className="text-sm text-destructive">{errors.landType.message}</p>}
                    </div>

                    {/* Share Percent */}
                    <div className="grid gap-2">
                        <Label htmlFor="sharePercent">Share (%)</Label>
                        <Input
                            id="sharePercent"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 50"
                            {...register("sharePercent")}
                        />
                        {errors.sharePercent && <p className="text-sm text-destructive">{errors.sharePercent.message}</p>}
                    </div>

                    {/* Acquisition Type */}
                    <div className="grid gap-2">
                        <Label htmlFor="acquisitionType">Acquisition Type</Label>
                        <Select
                            value={watch("acquisitionType")}
                            onValueChange={(v) => setValue("acquisitionType", v as CreateLandRecordFormData["acquisitionType"])}
                        >
                            <SelectTrigger id="acquisitionType">
                                <SelectValue placeholder="Select acquisition type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Purchase">Purchase</SelectItem>
                                <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                                <SelectItem value="POA">POA</SelectItem>
                                <SelectItem value="Inheritance">Inheritance</SelectItem>
                                <SelectItem value="Gift">Gift</SelectItem>
                                <SelectItem value="Lease">Lease</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.acquisitionType && <p className="text-sm text-destructive">{errors.acquisitionType.message}</p>}
                    </div>

                    {/* Acquisition Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                        <Input id="acquisitionDate" type="date" {...register("acquisitionDate")} />
                        {errors.acquisitionDate && <p className="text-sm text-destructive">{errors.acquisitionDate.message}</p>}
                    </div>

                    {/* Mutation Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="mutationStatus">Mutation Status</Label>
                        <Select
                            value={watch("mutationStatus")}
                            onValueChange={(v) => setValue("mutationStatus", v as CreateLandRecordFormData["mutationStatus"])}
                        >
                            <SelectTrigger id="mutationStatus">
                                <SelectValue placeholder="Select mutation status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.mutationStatus && <p className="text-sm text-destructive">{errors.mutationStatus.message}</p>}
                    </div>

                    {/* Development Agreement Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="developmentAgreementStatus">Development Agreement</Label>
                        <Select
                            value={watch("developmentAgreementStatus")}
                            onValueChange={(v) => setValue("developmentAgreementStatus", v as CreateLandRecordFormData["developmentAgreementStatus"])}
                        >
                            <SelectTrigger id="developmentAgreementStatus">
                                <SelectValue placeholder="Select agreement status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Signed">Signed</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Expired">Expired</SelectItem>
                                <SelectItem value="Terminated">Terminated</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.developmentAgreementStatus && (
                            <p className="text-sm text-destructive">{errors.developmentAgreementStatus.message}</p>
                        )}
                    </div>

                    {/* Total Owners */}
                    <div className="grid gap-2">
                        <Label htmlFor="totalOwners">Total Owners</Label>
                        <Input
                            id="totalOwners"
                            type="number"
                            placeholder="e.g. 5"
                            {...register("totalOwners")}
                        />
                        {errors.totalOwners && <p className="text-sm text-destructive">{errors.totalOwners.message}</p>}
                    </div>

                    {/* Available Area */}
                    <div className="grid gap-2">
                        <Label htmlFor="availableArea">Available Area</Label>
                        <Input
                            id="availableArea"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 4.5"
                            {...register("availableArea")}
                        />
                        {errors.availableArea && <p className="text-sm text-destructive">{errors.availableArea.message}</p>}
                    </div>

                    {/* Area */}
                    <div className="grid gap-2">
                        <Label htmlFor="area">Area (Katha) *</Label>
                        <Input
                            id="area"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 5.2"
                            {...register("area")}
                        />
                        {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
                    </div>

                    {/* Valuation */}
                    <div className="grid gap-2">
                        <Label htmlFor="valuation">Valuation (৳) *</Label>
                        <Input
                            id="valuation"
                            type="number"
                            placeholder="e.g. 5200000"
                            {...register("valuation")}
                        />
                        {errors.valuation && <p className="text-sm text-destructive">{errors.valuation.message}</p>}
                    </div>

                    {/* Estimated Project Yield */}
                    <div className="grid gap-2">
                        <Label htmlFor="estimatedProjectYield">Est. Project Yield</Label>
                        <Input
                            id="estimatedProjectYield"
                            placeholder="e.g. 5000000"
                            {...register("estimatedProjectYield")}
                        />
                        {errors.estimatedProjectYield && (
                            <p className="text-sm text-destructive">{errors.estimatedProjectYield.message}</p>
                        )}
                    </div>

                    {/* Documents Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="documentsStatus">Documents Status</Label>
                        <Select
                            value={watch("documentsStatus")}
                            onValueChange={(v) => setValue("documentsStatus", v as CreateLandRecordFormData["documentsStatus"])}
                        >
                            <SelectTrigger id="documentsStatus">
                                <SelectValue placeholder="Select documents status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Complete">Complete</SelectItem>
                                <SelectItem value="Incomplete">Incomplete</SelectItem>
                                <SelectItem value="Partial">Partial</SelectItem>
                                <SelectItem value="Missing">Missing</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.documentsStatus && <p className="text-sm text-destructive">{errors.documentsStatus.message}</p>}
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={statusValue}
                            onValueChange={(v) => setValue("status", v as CreateLandRecordFormData["status"])}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Acquired">Acquired</SelectItem>
                                <SelectItem value="Verified">Verified</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                    </div>

                    {/* Last Updated */}
                    <div className="grid gap-2">
                        <Label htmlFor="lastUpdated">Last Updated</Label>
                        <Input id="lastUpdated" type="date" {...register("lastUpdated")} />
                        {errors.lastUpdated && <p className="text-sm text-destructive">{errors.lastUpdated.message}</p>}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/land")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Record"}
                    </Button>
                </div>
            </form>
        </div>
    );
}