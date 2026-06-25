Update the Employee Management module as follows:

### 1. Replace Add Employee Modal with Dedicated Page

Remove the existing "Add Employee" modal and create a full-page form accessible via the "Add Employee" button.

**Route:**

* `/hr/create-employee`

**Page Title:**

* Add Employee

**Actions:**

* Save Employee
* Save & Add Another
* Cancel

---

### 2. Employee Form Sections

#### Basic Information

* Employee ID (Auto-generated, Read-only)
* Full Name *
* Date of Birth *
* Gender *

  * Male
  * Female
  * Other
* NID Number
* Mobile Number *
* Email

#### Address Information

* Present Address
* Permanent Address
* Checkbox: "Same as Present Address"

#### Employment Information

* Department *
* Designation *
* Employment Type *

  * Permanent
  * Contract
  * Intern
  * Consultant
* Joining Date *
* Reporting Manager (Dropdown Employee List)
* Salary
* Employee Status *

  * Active
  * Probation
  * Resigned
  * Terminated

#### Banking Information

* Bank Name
* Bank Account Number

#### Family Information

* Father's Name
* Mother's Name
* Spouse Name

#### Emergency Contact

* Emergency Contact Name *
* Emergency Contact Relationship *
* Emergency Contact Number *

---

### 3. Validation Rules

Required Fields:

* Full Name
* Date of Birth
* Gender
* Mobile Number
* Department
* Designation
* Employment Type
* Joining Date
* Employee Status
* Emergency Contact Name
* Emergency Contact Relationship
* Emergency Contact Number

Validation:

* Email must be valid format
* Mobile numbers must be numeric
* Salary must be numeric
* NID Number must be unique
* Employee ID must be auto-generated and unique

---

### 4. Update Employee Database Table

Add the following columns if not already available:

| Column Name                    | Type        |
| ------------------------------ | ----------- |
| employee_id                    | string      |
| full_name                      | string      |
| date_of_birth                  | date        |
| gender                         | enum        |
| nid_number                     | string      |
| mobile_number                  | string      |
| email                          | string      |
| present_address                | text        |
| permanent_address              | text        |
| department                     | string      |
| designation                    | string      |
| employment_type                | string      |
| joining_date                   | date        |
| reporting_manager_id           | foreign key |
| salary                         | decimal     |
| bank_name                      | string      |
| bank_account_number            | string      |
| employee_status                | string      |
| father_name                    | string      |
| mother_name                    | string      |
| spouse_name                    | string      |
| emergency_contact_name         | string      |
| emergency_contact_relationship | string      |
| emergency_contact_number       | string      |
| created_at                     | timestamp   |
| updated_at                     | timestamp   |

---

### 5. Update Employee Listing Table

Display the following columns:

* Employee ID
* Full Name
* Department
* Designation
* Mobile Number
* Employment Type
* Joining Date
* Employee Status
* Reporting Manager
* Actions

Actions:

* View
* Edit
* Delete

Features:

* Search by Employee ID, Name, Mobile, Email
* Filter by Department
* Filter by Designation
* Filter by Employee Status
* Pagination
* Export CSV/Excel

---

### 6. Employee Details View Page

Create a dedicated employee profile page displaying:

* Employee Information
* Employment Information
* Banking Information
* Family Information
* Emergency Contact Information

Include:

* Edit Employee button
* Delete Employee button
* Employee Status Badge
