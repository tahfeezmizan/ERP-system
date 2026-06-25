"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  createEmployeeSchema,
  type CreateEmployeeFormData,
} from "@/schemas";
import type { Employee } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const GENDERS = ["Male", "Female", "Other"] as const;
const EMPLOYMENT_TYPES = [
  "Permanent",
  "Contract",
  "Intern",
  "Consultant",
] as const;
const EMPLOYEE_STATUSES = [
  "Active",
  "Probation",
  "Resigned",
  "Terminated",
] as const;

const defaultValues: CreateEmployeeFormData = {
  fullName: "",
  dateOfBirth: "",
  gender: "Male",
  nidNumber: "",
  mobileNumber: "",
  email: "",
  presentAddress: "",
  permanentAddress: "",
  department: "",
  designation: "",
  employmentType: "Permanent",
  joiningDate: "",
  reportingManagerId: "",
  salary: "",
  bankName: "",
  bankAccountNumber: "",
  employeeStatus: "Active",
  fatherName: "",
  motherName: "",
  spouseName: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactNumber: "",
};

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

interface EmployeeFormProps {
  mode: "create" | "edit";
  employeeIdDisplay?: string;
  managers: Employee[];
  excludeManagerId?: string;
  initialValues?: Partial<CreateEmployeeFormData>;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (
    data: CreateEmployeeFormData,
    action: "save" | "another",
  ) => Promise<void>;
  showSaveAnother?: boolean;
}

export function EmployeeForm({
  mode,
  employeeIdDisplay,
  managers,
  excludeManagerId,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
  showSaveAnother = true,
}: EmployeeFormProps) {
  const [sameAddress, setSameAddress] = useState(false);
  const [saveAction, setSaveAction] = useState<"save" | "another">("save");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const presentAddress = watch("presentAddress");
  const genderValue = watch("gender");
  const employmentTypeValue = watch("employmentType");
  const employeeStatusValue = watch("employeeStatus");
  const reportingManagerValue = watch("reportingManagerId");

  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues });
      if (
        initialValues.presentAddress &&
        initialValues.presentAddress === initialValues.permanentAddress
      ) {
        setSameAddress(true);
      }
    }
  }, [initialValues, reset]);

  useEffect(() => {
    if (sameAddress) {
      setValue("permanentAddress", presentAddress ?? "", {
        shouldValidate: true,
      });
    }
  }, [sameAddress, presentAddress, setValue]);

  const managerOptions = managers.filter((m) => m.id !== excludeManagerId);

  const submitHandler = handleSubmit(async (data) => {
    await onSubmit(data, saveAction);
    if (saveAction === "another") {
      reset(defaultValues);
      setSameAddress(false);
    }
  });

  return (
    <form className="space-y-6" onSubmit={submitHandler}>
      <FormSection title="Basic Information">
        <div className="grid gap-2">
          <Label htmlFor="employee-id">Employee ID</Label>
          <Input
            id="employee-id"
            value={employeeIdDisplay ?? "Auto-generated on save"}
            readOnly
            className="bg-gray-50 font-mono text-sm"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name *</Label>
          <Input
            id="full-name"
            placeholder="e.g. John Smith"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date-of-birth">Date of Birth *</Label>
          <Input id="date-of-birth" type="date" {...register("dateOfBirth")} />
          <FieldError message={errors.dateOfBirth?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={genderValue}
            onValueChange={(v) =>
              setValue("gender", v as CreateEmployeeFormData["gender"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.gender?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="nid-number">NID Number</Label>
          <Input
            id="nid-number"
            placeholder="National ID number"
            {...register("nidNumber")}
          />
          <FieldError message={errors.nidNumber?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobile-number">Mobile Number *</Label>
          <Input
            id="mobile-number"
            placeholder="e.g. 01712345678"
            {...register("mobileNumber")}
          />
          <FieldError message={errors.mobileNumber?.message} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. john@company.com"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </FormSection>

      <FormSection title="Address Information">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="present-address">Present Address</Label>
          <Textarea
            id="present-address"
            rows={3}
            placeholder="Current residential address"
            {...register("presentAddress")}
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="permanent-address">Permanent Address</Label>
          <Textarea
            id="permanent-address"
            rows={3}
            placeholder="Permanent address"
            disabled={sameAddress}
            {...register("permanentAddress")}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="same-address"
            type="checkbox"
            checked={sameAddress}
            onChange={(e) => setSameAddress(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="same-address" className="font-normal">
            Same as Present Address
          </Label>
        </div>
      </FormSection>

      <FormSection title="Employment Information">
        <div className="grid gap-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            placeholder="e.g. Sales"
            {...register("department")}
          />
          <FieldError message={errors.department?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            placeholder="e.g. Property Manager"
            {...register("designation")}
          />
          <FieldError message={errors.designation?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="employment-type">Employment Type *</Label>
          <Select
            value={employmentTypeValue}
            onValueChange={(v) =>
              setValue(
                "employmentType",
                v as CreateEmployeeFormData["employmentType"],
                { shouldValidate: true },
              )
            }
          >
            <SelectTrigger id="employment-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.employmentType?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="joining-date">Joining Date *</Label>
          <Input id="joining-date" type="date" {...register("joiningDate")} />
          <FieldError message={errors.joiningDate?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reporting-manager">Reporting Manager</Label>
          <Select
            value={reportingManagerValue || "none"}
            onValueChange={(v) =>
              setValue("reportingManagerId", v === "none" ? "" : v, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="reporting-manager">
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {managerOptions.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.fullName} ({m.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            type="number"
            placeholder="e.g. 5000"
            {...register("salary")}
          />
          <FieldError message={errors.salary?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="employee-status">Employee Status *</Label>
          <Select
            value={employeeStatusValue}
            onValueChange={(v) =>
              setValue(
                "employeeStatus",
                v as CreateEmployeeFormData["employeeStatus"],
                { shouldValidate: true },
              )
            }
          >
            <SelectTrigger id="employee-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.employeeStatus?.message} />
        </div>
      </FormSection>

      <FormSection title="Banking Information">
        <div className="grid gap-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input
            id="bank-name"
            placeholder="e.g. DBBL"
            {...register("bankName")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bank-account">Bank Account Number</Label>
          <Input
            id="bank-account"
            placeholder="Account number"
            {...register("bankAccountNumber")}
          />
        </div>
      </FormSection>

      <FormSection title="Family Information">
        <div className="grid gap-2">
          <Label htmlFor="father-name">Father&apos;s Name</Label>
          <Input id="father-name" {...register("fatherName")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mother-name">Mother&apos;s Name</Label>
          <Input id="mother-name" {...register("motherName")} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="spouse-name">Spouse Name</Label>
          <Input id="spouse-name" {...register("spouseName")} />
        </div>
      </FormSection>

      <FormSection title="Emergency Contact">
        <div className="grid gap-2">
          <Label htmlFor="emergency-name">Emergency Contact Name *</Label>
          <Input id="emergency-name" {...register("emergencyContactName")} />
          <FieldError message={errors.emergencyContactName?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="emergency-relationship">
            Emergency Contact Relationship *
          </Label>
          <Input
            id="emergency-relationship"
            placeholder="e.g. Spouse, Father"
            {...register("emergencyContactRelationship")}
          />
          <FieldError message={errors.emergencyContactRelationship?.message} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="emergency-number">Emergency Contact Number *</Label>
          <Input
            id="emergency-number"
            placeholder="e.g. 01712345678"
            {...register("emergencyContactNumber")}
          />
          <FieldError message={errors.emergencyContactNumber?.message} />
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {showSaveAnother && mode === "create" && (
          <Button
            type="submit"
            variant="outline"
            disabled={isLoading}
            onClick={() => setSaveAction("another")}
          >
            {isLoading && saveAction === "another"
              ? "Saving..."
              : "Save & Add Another"}
          </Button>
        )}
        <Button
          type="submit"
          className="bg-gray-900 text-white hover:bg-gray-700"
          disabled={isLoading}
          onClick={() => setSaveAction("save")}
        >
          {isLoading && saveAction === "save"
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Save Employee"}
        </Button>
      </div>
    </form>
  );
}
