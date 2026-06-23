"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCreateProjectMutation } from "@/services/moduleApis";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas";
import { ArrowLeft } from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const [createProject] = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      location: "",
      budget: undefined,
      startDate: "",
      endDate: "",
      rajukApproval: false,
    },
  });

  async function onSubmit(values: CreateProjectFormData) {
    try {
      await createProject(values).unwrap();
      toast.success("Project created successfully");
      reset();
      router.push("/projects");
    } catch {
      toast.error("Failed to create project");
    }
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/land")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
          <p className="text-sm text-muted-foreground">Create a new project</p>
        </div>
      </div> */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Project</h1>
            <p className="text-sm text-muted-foreground">
              Enter project information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/projects")}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" space-y-6 border p-4 rounded-lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="proj-name">Project Name</Label>
            <Input
              id="proj-name"
              placeholder="e.g. Skyline Tower"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-code">Project Code</Label>
            <Input
              id="proj-code"
              placeholder="e.g. SKT-003"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="grid gap-2 ">
            <Label htmlFor="proj-location">Location</Label>
            <Input
              id="proj-location"
              placeholder="e.g. Banani, Dhaka"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="grid gap-2 ">
            <Label htmlFor="proj-budget">Total Budget (৳)</Label>
            <Input
              id="proj-budget"
              type="number"
              placeholder="e.g. 1200000000"
              {...register("budget")}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">
                {errors.budget.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-actual">Actual Cost (৳)</Label>
            <Input
              id="proj-actual"
              type="number"
              placeholder="e.g. 450000000"
              {...register("actualCost")}
            />
            {errors.actualCost && (
              <p className="text-sm text-destructive">
                {errors.actualCost.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-type">Project Type</Label>
            <Input
              id="proj-type"
              placeholder="e.g. Residential"
              {...register("projectType")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-land-area">Land Area (decimal)</Label>
            <Input
              id="proj-land-area"
              type="number"
              step="0.01"
              placeholder="e.g. 5.2"
              {...register("landArea")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-available-units">Available Units</Label>
            <Input
              id="proj-available-units"
              type="number"
              {...register("availableUnits")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-sold-units">Sold Units</Label>
            <Input
              id="proj-sold-units"
              type="number"
              {...register("soldUnits")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-reserved-units">Reserved Units</Label>
            <Input
              id="proj-reserved-units"
              type="number"
              {...register("reservedUnits")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-collection">Collection Amount (৳)</Label>
            <Input
              id="proj-collection"
              type="number"
              {...register("collectionAmount")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-due">Due Amount (৳)</Label>
            <Input id="proj-due" type="number" {...register("dueAmount")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-manager">Project Manager</Label>
            <Input
              id="proj-manager"
              placeholder="Manager name"
              {...register("projectManager")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-expected">Expected Completion</Label>
            <Input
              id="proj-expected"
              type="date"
              {...register("expectedCompletion")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-start">Start Date</Label>
            <Input id="proj-start" type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-destructive">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proj-end">Expected End Date</Label>
            <Input id="proj-end" type="date" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-sm text-destructive">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id="proj-rajuk"
              type="checkbox"
              className="h-4 w-4 accent-primary"
              {...register("rajukApproval")}
            />
            <Label htmlFor="proj-rajuk" className="cursor-pointer">
              RAJUK Approval Obtained
            </Label>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Project"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
