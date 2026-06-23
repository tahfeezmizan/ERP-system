import type {
  ActivityItem,
  Booking,
  ChartDataPoint,
  Collection,
  Customer,
  KpiMetric,
  LandRecord,
  Lead,
  Notification,
  Project,
  PropertyUnit,
  Task,
} from "@/types";
import type { Project as ProjectModel } from "@/app/(dashboard)/projects/model";

// alias to keep existing Project name usage
type Project = ProjectModel;

export const mockKpis: KpiMetric[] = [
  { id: "1", label: "Today's Collection", value: "৳12,50,000", change: 8.5, trend: "up" },
  { id: "2", label: "Monthly Collection", value: "৳2,45,00,000", change: 12.3, trend: "up" },
  { id: "3", label: "Monthly Sales", value: "৳3,80,00,000", change: -2.1, trend: "down" },
  { id: "4", label: "Available Units", value: 142, change: -5, trend: "down" },
  { id: "5", label: "Booked Units", value: 89, change: 12, trend: "up" },
  { id: "6", label: "Sold Units", value: 256, change: 8, trend: "up" },
  { id: "7", label: "Due Amount", value: "৳1,85,00,000", change: 3.2, trend: "up" },
  { id: "8", label: "Cash Position", value: "৳5,20,00,000", change: 5.7, trend: "up" },
  { id: "9", label: "Construction Progress", value: "68%", change: 4, trend: "up" },
  { id: "10", label: "Upcoming Handover", value: 12, change: 2, trend: "up" },
  { id: "11", label: "Active Leads", value: 234, change: 18, trend: "up" },
  { id: "12", label: "Pending Approvals", value: 7, change: -3, trend: "down" },
];

export const mockSalesTrend: ChartDataPoint[] = [
  { name: "Jan", value: 28000000, sales: 28000000 },
  { name: "Feb", value: 32000000, sales: 32000000 },
  { name: "Mar", value: 25000000, sales: 25000000 },
  { name: "Apr", value: 38000000, sales: 38000000 },
  { name: "May", value: 42000000, sales: 42000000 },
  { name: "Jun", value: 35000000, sales: 35000000 },
];

export const mockCollectionTrend: ChartDataPoint[] = [
  { name: "Jan", value: 22000000, collection: 22000000 },
  { name: "Feb", value: 24500000, collection: 24500000 },
  { name: "Mar", value: 21000000, collection: 21000000 },
  { name: "Apr", value: 28000000, collection: 28000000 },
  { name: "May", value: 31000000, collection: 31000000 },
  { name: "Jun", value: 26500000, collection: 26500000 },
];

export const mockLeadConversion: ChartDataPoint[] = [
  { name: "Lead", value: 450 },
  { name: "Interested", value: 280 },
  { name: "Site Visit", value: 180 },
  { name: "Negotiation", value: 95 },
  { name: "Booking", value: 62 },
  { name: "Agreement", value: 48 },
  { name: "Registration", value: 35 },
  { name: "Handover", value: 28 },
];

export const mockUnitStatus: ChartDataPoint[] = [
  { name: "Available", value: 142 },
  { name: "Reserved", value: 23 },
  { name: "Booked", value: 89 },
  { name: "Sold", value: 256 },
  { name: "Handover Pending", value: 15 },
  { name: "Handed Over", value: 198 },
];

export const mockCashFlow: ChartDataPoint[] = [
  { name: "Jan", inflow: 35000000, outflow: 28000000 },
  { name: "Feb", inflow: 38000000, outflow: 30000000 },
  { name: "Mar", inflow: 32000000, outflow: 29000000 },
  { name: "Apr", inflow: 42000000, outflow: 35000000 },
  { name: "May", inflow: 45000000, outflow: 38000000 },
  { name: "Jun", inflow: 40000000, outflow: 33000000 },
];

export const mockProjects: Project[] = [
  {
    id: "proj_1",
    name: "Green Valley Residency",
    code: "GVR-001",
    location: "Uttara, Dhaka",
    projectType: "Residential",
    status: "Sales",
    budget: 850000000,
    spent: 620000000,
    rajukApproval: true,
    startDate: "2023-01-15",
    endDate: "2026-06-30",
    completionPercent: 78,
    landArea: 5.2,
    availableUnits: 142,
    soldUnits: 256,
    reservedUnits: 23,
    collectionAmount: 245000000,
    dueAmount: 185000000,
    expectedCompletion: "2026-06-30",
    projectManager: "Karim Ahmed",
    createdAt: "2023-01-10",
  },
  {
    id: "proj_2",
    name: "Skyline Tower",
    code: "SKT-002",
    location: "Banani, Dhaka",
    projectType: "Residential",
    status: "Construction",
    budget: 1200000000,
    spent: 450000000,
    rajukApproval: true,
    startDate: "2024-03-01",
    endDate: "2027-12-31",
    completionPercent: 45,
    landArea: 3.8,
    availableUnits: 200,
    soldUnits: 80,
    reservedUnits: 20,
    collectionAmount: 120000000,
    dueAmount: 300000000,
    expectedCompletion: "2027-12-31",
    projectManager: "Nusrat Jahan",
    createdAt: "2024-02-20",
  },
  {
    id: "proj_3",
    name: "Lake View Apartments",
    code: "LVA-003",
    location: "Gulshan, Dhaka",
    projectType: "Residential",
    status: "Planning",
    budget: 950000000,
    spent: 85000000,
    rajukApproval: false,
    startDate: "2025-06-01",
    endDate: "2028-03-31",
    completionPercent: 12,
    landArea: 4.5,
    availableUnits: 300,
    soldUnits: 0,
    reservedUnits: 0,
    collectionAmount: 0,
    dueAmount: 0,
    expectedCompletion: "2028-03-31",
    projectManager: "",
    createdAt: "2025-05-01",
  },
];

export const mockLandRecords: LandRecord[] = [
  {
    id: "land_1",
    mouza: "Uttara",
    khatian: "125",
    dag: "456",
    csRecord: "CS-125/456",
    rsRecord: "RS-125/456",
    area: 5.2,
    valuation: 52000000,
    status: "Verified",
    owners: [
      {
        id: "owner_1",
        name: "Abdul Karim",
        nid: "1234567890123",
        phone: "01712345678",
        ownershipShare: 60,
        address: "Uttara, Dhaka",
      },
      {
        id: "owner_2",
        name: "Fatema Begum",
        nid: "9876543210987",
        phone: "01812345678",
        ownershipShare: 40,
        address: "Uttara, Dhaka",
      },
    ],
    projectId: "proj_1",
  },
  {
    id: "land_2",
    mouza: "Banani",
    khatian: "89",
    dag: "234",
    area: 3.8,
    valuation: 95000000,
    status: "Acquired",
    owners: [
      {
        id: "owner_3",
        name: "Rafiqul Islam",
        nid: "4567890123456",
        phone: "01912345678",
        ownershipShare: 100,
        address: "Banani, Dhaka",
      },
    ],
    projectId: "proj_2",
  },
];

export const mockUnits: PropertyUnit[] = [
  {
    id: "unit_1",
    projectId: "proj_1",
    projectName: "Green Valley Residency",
    building: "Tower A",
    block: "Block 1",
    floor: 5,
    unitNumber: "A-501",
    unitType: "Apartment",
    area: 1250,
    facing: "East",
    price: 8000000,
    status: "Available",
  },
  {
    id: "unit_2",
    projectId: "proj_1",
    projectName: "Green Valley Residency",
    building: "Tower A",
    block: "Block 1",
    floor: 8,
    unitNumber: "A-802",
    unitType: "Apartment",
    area: 1450,
    facing: "South",
    price: 9500000,
    status: "Booked",
  },
  {
    id: "unit_3",
    projectId: "proj_1",
    projectName: "Green Valley Residency",
    building: "Tower B",
    block: "Block 2",
    floor: 3,
    unitNumber: "B-G01",
    unitType: "Shop",
    area: 850,
    facing: "North",
    price: 12000000,
    status: "Sold",
  },
];

export const mockLeads: Lead[] = [
  {
    id: "lead_1",
    name: "Mohammad Hasan",
    phone: "01711223344",
    email: "hasan@email.com",
    source: "Facebook",
    stage: "Site Visit",
    assignedTo: "Karim Ahmed",
    projectInterest: "Green Valley Residency",
    budget: 8500000,
    createdAt: "2025-06-01",
    lastFollowUp: "2025-06-18",
  },
  {
    id: "lead_2",
    name: "Sadia Rahman",
    phone: "01822334455",
    source: "Referral",
    stage: "Negotiation",
    assignedTo: "Nusrat Jahan",
    projectInterest: "Skyline Tower",
    budget: 12000000,
    createdAt: "2025-05-20",
    lastFollowUp: "2025-06-19",
  },
  {
    id: "lead_3",
    name: "Imran Hossain",
    phone: "01933445566",
    email: "imran@email.com",
    source: "Walk-In",
    stage: "Lead",
    assignedTo: "Karim Ahmed",
    projectInterest: "Lake View Apartments",
    budget: 15000000,
    createdAt: "2025-06-20",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "book_1",
    bookingNo: "BK-2025-001",
    customerId: "cust_1",
    customerName: "Mohammad Hasan",
    unitId: "unit_2",
    unitNumber: "A-802",
    projectName: "Green Valley Residency",
    bookingDate: "2025-06-10",
    bookingAmount: 500000,
    totalPrice: 9500000,
    status: "Approved",
  },
  {
    id: "book_2",
    bookingNo: "BK-2025-002",
    customerId: "cust_2",
    customerName: "Sadia Rahman",
    unitId: "unit_3",
    unitNumber: "B-G01",
    projectName: "Green Valley Residency",
    bookingDate: "2025-06-15",
    bookingAmount: 600000,
    totalPrice: 12000000,
    status: "Pending",
  },
];

export const mockCollections: Collection[] = [
  {
    id: "coll_1",
    receiptNo: "MR-2025-001",
    bookingId: "book_1",
    customerName: "Mohammad Hasan",
    amount: 500000,
    type: "Booking Money",
    paymentDate: "2025-06-10",
    paymentMethod: "Bank Transfer",
    status: "Received",
  },
  {
    id: "coll_2",
    receiptNo: "MR-2025-002",
    bookingId: "book_1",
    customerName: "Mohammad Hasan",
    amount: 1500000,
    type: "Down Payment",
    paymentDate: "2025-06-15",
    paymentMethod: "Cheque",
    status: "Received",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "cust_1",
    name: "Mohammad Hasan",
    phone: "01711223344",
    email: "hasan@email.com",
    nid: "1234567890123",
    address: "Mirpur, Dhaka",
    nominee: "Ayesha Hasan",
    totalDue: 7500000,
    totalPaid: 2000000,
    status: "Active",
  },
  {
    id: "cust_2",
    name: "Sadia Rahman",
    phone: "01822334455",
    email: "sadia@email.com",
    nid: "9876543210987",
    address: "Dhanmondi, Dhaka",
    totalDue: 11400000,
    totalPaid: 600000,
    status: "Active",
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "act_1",
    type: "booking",
    title: "New Booking Approved",
    description: "Unit A-802 booked by Mohammad Hasan",
    timestamp: "2025-06-20T10:30:00",
    user: "Karim Ahmed",
  },
  {
    id: "act_2",
    type: "collection",
    title: "Payment Received",
    description: "৳15,00,000 down payment from Mohammad Hasan",
    timestamp: "2025-06-20T09:15:00",
    user: "Finance Team",
  },
  {
    id: "act_3",
    type: "lead",
    title: "New Lead Assigned",
    description: "Imran Hossain assigned to Karim Ahmed",
    timestamp: "2025-06-19T16:45:00",
    user: "System",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    title: "Booking Approval Required",
    message: "Booking BK-2025-002 pending your approval",
    type: "warning",
    read: false,
    createdAt: "2025-06-20T08:00:00",
  },
  {
    id: "notif_2",
    title: "Payment Overdue",
    message: "Customer Mohammad Hasan has overdue installment",
    type: "error",
    read: false,
    createdAt: "2025-06-19T14:30:00",
  },
  {
    id: "notif_3",
    title: "Site Visit Scheduled",
    message: "Site visit for Sadia Rahman tomorrow at 11 AM",
    type: "info",
    read: true,
    createdAt: "2025-06-18T11:00:00",
  },
];

export const mockTasks: Task[] = [
  {
    id: "task_1",
    title: "Approve Booking BK-2025-002",
    dueDate: "2025-06-21",
    priority: "High",
    status: "Pending",
    assignedTo: "Admin",
  },
  {
    id: "task_2",
    title: "Follow up with Imran Hossain",
    dueDate: "2025-06-22",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Karim Ahmed",
  },
];

export const mockConstructionProgress = {
  foundation: 100,
  structure: 85,
  brickWork: 72,
  electrical: 45,
  plumbing: 40,
  finishing: 25,
  overall: 68,
};

export const mockInventoryItems = [
  { id: "inv_1", name: "Cement (OPC 53)", category: "Cement", stock: 850, unit: "Bag", reorderLevel: 200, value: 425000 },
  { id: "inv_2", name: "Rod 60 Grade", category: "Rod", stock: 120, unit: "Ton", reorderLevel: 30, value: 9600000 },
  { id: "inv_3", name: "First Class Brick", category: "Brick", stock: 50000, unit: "Pcs", reorderLevel: 10000, value: 750000 },
];

export const mockContractors = [
  { id: "con_1", name: "ABC Construction Ltd.", type: "Main Contractor", activeProjects: 2, rating: 4.5, pendingBills: 3500000 },
  { id: "con_2", name: "ElectroTech Services", type: "Electrical", activeProjects: 3, rating: 4.2, pendingBills: 850000 },
];

export const mockEmployees = [
  { id: "emp_1", name: "Karim Ahmed", department: "Sales", designation: "Sales Executive", status: "Active" },
  { id: "emp_2", name: "Nusrat Jahan", department: "Sales", designation: "Sales Manager", status: "Active" },
  { id: "emp_3", name: "Rashid Khan", department: "Finance", designation: "Accountant", status: "Active" },
];

export const mockComplaints = [
  { id: "comp_1", ticketNo: "TKT-001", customer: "Mohammad Hasan", unit: "A-802", issue: "Water leakage in bathroom", status: "Open", priority: "High" },
  { id: "comp_2", ticketNo: "TKT-002", customer: "Sadia Rahman", unit: "B-G01", issue: "Electrical socket not working", status: "In Progress", priority: "Medium" },
];

export const mockProcurementOrders = [
  { id: "po_1", poNo: "PO-2025-001", vendor: "BuildMart Supplies", amount: 2500000, status: "Approved", date: "2025-06-01" },
  { id: "po_2", poNo: "PO-2025-002", vendor: "Steel Corp BD", amount: 8500000, status: "Pending", date: "2025-06-15" },
];

export const mockFinanceAccounts = [
  { id: "acc_1", code: "1001", name: "Cash in Hand", type: "Asset", balance: 5200000 },
  { id: "acc_2", code: "1002", name: "Bank - DBBL", type: "Asset", balance: 45000000 },
  { id: "acc_3", code: "4001", name: "Sales Revenue", type: "Revenue", balance: 125000000 },
];
