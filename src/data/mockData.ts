import { Customer, RepairTicket, RepairStatus, Priority, Grade, Technician } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Somewhere, ST 67890',
    createdAt: '2025-01-14T14:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 456-7890',
    address: '789 Pine Rd, Elsewhere, ST 54321',
    createdAt: '2025-01-13T09:15:00Z'
  }
];

export const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex@repairshop.com',
    specialties: ['iPhone', 'Samsung', 'iPad'],
    activeTickets: 3
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@repairshop.com',
    specialties: ['MacBook', 'Windows Laptop', 'Desktop'],
    activeTickets: 2
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david@repairshop.com',
    specialties: ['Gaming Console', 'Tablet', 'Android'],
    activeTickets: 4
  }
];

export const mockRepairTickets: RepairTicket[] = [
  {
    id: 'RPR-001',
    customerId: '1',
    customerName: 'John Smith',
    deviceType: 'iPhone',
    deviceModel: 'iPhone 14 Pro',
    serialNumber: 'ABC123456789',
    issueDescription: 'Cracked screen, touch not responding in bottom right corner',
    estimatedCost: 299.99,
    actualCost: 279.99,
    status: RepairStatus.COMPLETED,
    priority: Priority.MEDIUM,
    grade: Grade.GOOD,
    gradeNotes: 'Minor scratches on back, good overall condition',
    technicianId: '1',
    technicianName: 'Alex Rodriguez',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-17T16:45:00Z',
    completedAt: '2025-01-17T16:45:00Z'
  },
  {
    id: 'RPR-002',
    customerId: '2',
    customerName: 'Sarah Johnson',
    deviceType: 'MacBook',
    deviceModel: 'MacBook Pro 16" 2023',
    issueDescription: 'Battery not holding charge, random shutdowns',
    estimatedCost: 199.99,
    status: RepairStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    grade: Grade.EXCELLENT,
    gradeNotes: 'Like new condition, only battery issue',
    technicianId: '2',
    technicianName: 'Emma Wilson',
    createdAt: '2025-01-16T14:20:00Z',
    updatedAt: '2025-01-17T11:30:00Z'
  },
  {
    id: 'RPR-003',
    customerId: '3',
    customerName: 'Mike Chen',
    deviceType: 'Samsung Galaxy',
    deviceModel: 'Galaxy S23 Ultra',
    issueDescription: 'Water damage, phone won\'t turn on',
    estimatedCost: 450.00,
    status: RepairStatus.DIAGNOSED,
    priority: Priority.URGENT,
    grade: Grade.POOR,
    gradeNotes: 'Significant water damage, multiple components affected',
    technicianId: '1',
    technicianName: 'Alex Rodriguez',
    createdAt: '2025-01-17T09:00:00Z',
    updatedAt: '2025-01-17T12:15:00Z'
  },
  {
    id: 'RPR-004',
    customerId: '1',
    customerName: 'John Smith',
    deviceType: 'iPad',
    deviceModel: 'iPad Air 5th Gen',
    issueDescription: 'Charging port loose, intermittent charging',
    estimatedCost: 129.99,
    status: RepairStatus.AWAITING_PARTS,
    priority: Priority.LOW,
    grade: Grade.FAIR,
    gradeNotes: 'Some wear on edges, overall functional',
    technicianId: '3',
    technicianName: 'David Kim',
    createdAt: '2025-01-17T15:45:00Z',
    updatedAt: '2025-01-17T16:20:00Z'
  }
];