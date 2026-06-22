Implement all Add/Create actions so that they are fully functional.

### Required Behavior

When a user clicks an **Add** button:

1. Open the corresponding Modal/Dialog form.
2. Allow the user to enter data into the form fields.
3. Validate required fields before submission.
4. When the user clicks **Save**:

   * Collect all form data.
   * Save the data to `localStorage`.
   * Show a success toast notification.
   * Close the modal.
   * Refresh the table automatically.
5. The newly created record must immediately appear in the corresponding table without requiring a page reload.

### Storage Rules

* Use a unique localStorage key for each module.
* Examples:

  * `landOwners`
  * `mouzas`
  * `khatians`
  * `dags`
  * `projects`
  * `buildings`
  * `apartments`
  * `customers`
  * `leads`
  * `bookings`
  * `collections`
  * `vendors`
  * `contractors`
  * `employees`
  * `complaints`

### Data Flow

Add Button
↓
Open Modal
↓
User Enters Data
↓
Click Save
↓
Validate Form
↓
Save Record to localStorage
↓
Show Success Toast
↓
Close Modal
↓
Reload Table Data
↓
Display New Record in Table

### Technical Requirements

* Use Shadcn Dialog for modal forms.
* Use React Hook Form for form state management.
* Use Zod for validation.
* Use Sonner for success/error notifications.
* Disable the Save button while submitting.
* Handle localStorage read/write safely.
* Generate a unique ID and createdAt timestamp for every new record.

### Table Requirements

On component load:

* Read records from localStorage.
* Populate the table with stored data.
* If localStorage is empty, show an empty state.

After Save:

* Update localStorage.
* Update table state immediately.
* No page refresh required.

### Expected Result

Every Add/Create button across all modules must:

* Open a working form.
* Save submitted data to localStorage.
* Close successfully after save.
* Refresh and display the newly added record in the related table.
* Have no placeholder or non-functional behavior.
