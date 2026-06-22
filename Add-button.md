Analyze the entire application and fix all Add/Create actions across every module.

## Problem

Currently many "Add" buttons are either:

* Not working
* Missing functionality
* Not opening any form
* Not navigating to create pages
* Inconsistent across modules

This must be fixed application-wide.

---

## Required Behavior

Every Add/Create button must be functional.

Examples:

* Add Land Owner
* Add Mouza
* Add Khatian
* Add Dag
* Add Project
* Add Building
* Add Apartment
* Add Customer
* Add Lead
* Add Booking
* Add Collection
* Add Vendor
* Add Contractor
* Add Employee
* Add Complaint
* Add Report Filter
* Any other Create/Add action

No Add button should be a placeholder.

---

## UI Decision Rules

### Rule 1: Small Forms → Modal

If a form contains:

* Up to 8 input fields
* Simple data entry
* No complex workflow
* No file uploads
* No multi-step process

Then use:

Shadcn Dialog Modal

Examples:

* Add Mouza
* Add Khatian
* Add Dag
* Add Vendor
* Add Department
* Add Designation
* Add Category
* Add Unit Type

Behavior:

Click Add Button

↓

Open Modal

↓

Submit Form

↓

Show Sonner Success Toast

↓

Refresh Table

↓

Close Modal

---

### Rule 2: Medium Forms → Drawer

If form contains:

* 8 to 15 fields
* Moderate complexity

Use:

Shadcn Sheet / Drawer

Examples:

* Add Contractor
* Add Employee
* Add Customer
* Add Land Owner

Behavior:

Click Add

↓

Open Side Drawer

↓

Submit

↓

Success Toast

↓

Refresh Data

↓

Close Drawer

---

### Rule 3: Large Forms → Dedicated Create Page

If form contains:

* More than 15 fields
* Multiple sections
* File uploads
* Complex validation
* Child records
* Tabbed forms

Use:

Dedicated Create Page

Examples:

* Create Project
* Create Apartment
* Create Booking
* Create Customer Profile
* Create Construction Project
* Create Purchase Requisition
* Create Purchase Order
* Create Registration
* Create Handover

Pattern:

/projects/create

/customers/create

/bookings/create

/procurement/create

etc.

---

## Create Page Requirements

For large forms:

Create page structure:

Header

Breadcrumb

Back Button

Page Title

Save Button

Cancel Button

Form Sections

Sticky Action Bar

Responsive Layout

Use:

React Hook Form

Zod

Redux RTK Query

Sonner Toast

---

## Standard Add Button Component

Create reusable component:

ActionAddButton

Props:

```tsx
type ActionAddButtonProps = {
  label: string;
  mode: "modal" | "drawer" | "page";
  href?: string;
  onClick?: () => void;
};
```

Behavior:

mode="modal"

→ open dialog

mode="drawer"

→ open sheet

mode="page"

→ navigate to create page

Use this component across entire application.

---

## Modal Standards

Create reusable:

EntityCreateModal

Features:

* Shadcn Dialog
* React Hook Form
* Zod Validation
* Loading State
* Submit Button
* Cancel Button
* Sonner Toast

---

## Drawer Standards

Create reusable:

EntityCreateDrawer

Features:

* Shadcn Sheet
* Responsive Width
* Scrollable Form
* Validation
* Loading State

---

## Create Page Standards

Create reusable:

CreatePageLayout

Includes:

* Page Header
* Breadcrumbs
* Save Button
* Cancel Button
* Form Container
* Sticky Footer Actions

---

## Validation Requirements

Every create form must:

* Use React Hook Form
* Use Zod
* Show validation messages
* Disable submit during loading
* Show Sonner success toast
* Show Sonner error toast

No uncontrolled forms.

---

## Data Refresh Requirements

After successful creation:

1. Close Modal/Drawer OR Redirect from Create Page
2. Invalidate RTK Query Cache
3. Refresh Table Data
4. Show Success Toast

Use proper RTK Query tag invalidation.

---

## Audit Tasks

Scan the entire codebase and identify:

* Non-working Add buttons
* Placeholder Add buttons
* Missing Create forms
* Missing Create pages
* Missing Dialogs
* Missing Drawers

Fix every occurrence.

Generate a report listing:

* Fixed Add Buttons
* Created Modals
* Created Drawers
* Created Create Pages
* Remaining Issues (if any)

Goal:

100% of Add/Create actions throughout the ERP must be fully functional and follow the Modal → Drawer → Dedicated Page decision rules consistently.
