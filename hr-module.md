Create a Human Resources (HR) management page using a clean modular component architecture.

The HR page should be divided into multiple reusable components.

Folder structure should be:

src/
 └── components/
      └── hr/
          ├── KpiCard.jsx
          ├── HRHeader.jsx
          ├── HRTabs.jsx
          ├── EmployeeTable.jsx
          ├── AttendanceTable.jsx
          ├── PayrollTable.jsx
          ├── LeaveManagementTable.jsx
          ├── PerformanceTable.jsx
          └── index.js


Main page:

pages/
 └── HRPage.jsx


Architecture Rules:

1. HRPage.jsx will be the main controller component.

2. All HR related UI components must stay inside:
components/hr/

3. HRPage.jsx should not contain large UI code.
It should only:
- manage state
- prepare data
- pass props
- handle events


4. KPI Cards:

Create a reusable component:

KpiCard.jsx

Props:

{
 title,
 value,
 icon,
 color,
 description
}


Example:

const kpiData = [
 {
   title:"Total Employees",
   value:148,
   color:"green"
 },
 {
   title:"Present Today",
   value:132,
   color:"blue"
 },
 {
   title:"Pending Leave Requests",
   value:8,
   color:"orange"
 },
 {
   title:"Payroll This Month",
   value:"$245,000",
   color:"purple"
 }
];


HRPage.jsx should map this data:

{kpiData.map(item => (
   <KpiCard {...item}/>
))}


5. Tabs:

Create reusable HRTabs component.

Tabs:

- Overview
- Employees
- Attendance
- Payroll
- Leave Management
- Performance


Tab switching logic should be controlled from HRPage.jsx.

Example:

activeTab state should stay in HRPage.jsx.

Child components should receive only required data.


6. Payroll Table:

Create:

components/hr/PayrollTable.jsx


It should receive data from HRPage:

<PayrollTable data={payrollData}/>


Table columns:

Employee
Period
Gross
Deductions
Net
Status
Action


Example data:

[
 {
  employee:"John Smith",
  period:"June 2026",
  gross:8500,
  deductions:1200,
  net:7300,
  status:"Processed"
 }
]


7. Employee Table:

Create:

EmployeeTable.jsx


Fields:

Employee Name
Employee ID
Department
Designation
Joining Date
Status


8. Attendance Table:

Create:

AttendanceTable.jsx


Fields:

Employee
Date
Check In
Check Out
Working Hours
Status


9. Leave Management Table:

Create:

LeaveManagementTable.jsx


Fields:

Employee
Leave Type
Start Date
End Date
Days
Status


10. Performance Table:

Create:

PerformanceTable.jsx


Fields:

Employee
Review Period
Rating
Goal Completion
Status


11. Styling:

Use modern ERP dashboard UI style.

Requirements:

- Responsive design
- Clean card layout
- Rounded corners
- Soft shadows
- Professional HR dashboard look


12. Code Quality:

Follow:

- React component best practices
- Reusable components
- Props based communication
- No duplicated UI code
- Maintainable folder structure


13. Export:

components/hr/index.js

should export all HR components:

export {default as KpiCard} from './KpiCard'
export {default as PayrollTable} from './PayrollTable'
...


Final result:

HRPage.jsx should only look like a dashboard controller:

- import components
- define data
- map KPI cards
- control tabs
- render components

All UI logic must remain inside components/hr folder.