export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface RepairTicket {
  id: string;
  customerId: string;
  customerName: string;
  deviceType: string;
  deviceModel: string;
  serialNumber?: string;
  issueDescription: string;
  estimatedCost: number;
  actualCost?: number;
  status: RepairStatus;
  priority: Priority;
  grade?: Grade;
  gradeNotes?: string;
  technicianId?: string;
  technicianName?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  images?: string[];
}

export enum RepairStatus {
  RECEIVED = 'received',
  DIAGNOSED = 'diagnosed',
  IN_PROGRESS = 'in_progress',
  AWAITING_PARTS = 'awaiting_parts',
  TESTING = 'testing',
  COMPLETED = 'completed',
  READY_FOR_PICKUP = 'ready_for_pickup',
  PICKED_UP = 'picked_up',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum Grade {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged'
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  activeTickets: number;
}