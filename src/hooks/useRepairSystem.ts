import { useState } from 'react';
import { RepairTicket, Customer, RepairStatus } from '../types';
import { mockRepairTickets, mockCustomers, mockTechnicians } from '../data/mockData';

export const useRepairSystem = () => {
  const [tickets, setTickets] = useState<RepairTicket[]>(mockRepairTickets);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [technicians] = useState(mockTechnicians);

  const createTicket = (ticketData: Partial<RepairTicket>) => {
    const newTicket: RepairTicket = {
      id: `RPR-${String(tickets.length + 1).padStart(3, '0')}`,
      customerId: ticketData.customerId || '',
      customerName: ticketData.customerName || '',
      deviceType: ticketData.deviceType || '',
      deviceModel: ticketData.deviceModel || '',
      serialNumber: ticketData.serialNumber,
      issueDescription: ticketData.issueDescription || '',
      estimatedCost: ticketData.estimatedCost || 0,
      actualCost: ticketData.actualCost,
      status: ticketData.status || RepairStatus.RECEIVED,
      priority: ticketData.priority || 'medium',
      grade: ticketData.grade,
      gradeNotes: ticketData.gradeNotes,
      technicianId: ticketData.technicianId,
      technicianName: ticketData.technicianName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: ticketData.completedAt
    };

    setTickets(prev => [...prev, newTicket]);
  };

  const updateTicket = (ticketId: string, updates: Partial<RepairTicket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            completedAt: updates.status === RepairStatus.COMPLETED ? new Date().toISOString() : ticket.completedAt
          }
        : ticket
    ));
  };

  const createCustomer = (customerData: Partial<Customer>) => {
    const newCustomer: Customer = {
      id: String(customers.length + 1),
      name: customerData.name || '',
      email: customerData.email || '',
      phone: customerData.phone || '',
      address: customerData.address || '',
      createdAt: new Date().toISOString()
    };

    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === customerId ? { ...customer, ...updates } : customer
    ));
  };

  return {
    tickets,
    customers,
    technicians,
    createTicket,
    updateTicket,
    createCustomer,
    updateCustomer
  };
};