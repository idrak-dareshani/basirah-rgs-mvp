import { useState, useEffect } from 'react';
import { RepairTicket, Customer, RepairStatus } from '../types';
import { customerService } from '../services/customerService';
import { technicianService } from '../services/technicianService';
import { repairTicketService } from '../services/repairTicketService';

export const useRepairSystem = () => {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ticketsData, customersData, techniciansData] = await Promise.all([
        repairTicketService.getAll(),
        customerService.getAll(),
        technicianService.getAll()
      ]);

      setTickets(ticketsData);
      setCustomers(customersData);
      setTechnicians(techniciansData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Partial<RepairTicket>) => {
    try {
      const { filesToUpload, ...ticketDataWithoutFiles } = ticketData as any;
      const newTicket = await repairTicketService.create({
        customerId: ticketDataWithoutFiles.customerId || '',
        deviceType: ticketDataWithoutFiles.deviceType || '',
        deviceModel: ticketDataWithoutFiles.deviceModel || '',
        serialNumber: ticketDataWithoutFiles.serialNumber,
        issueDescription: ticketDataWithoutFiles.issueDescription || '',
        estimatedCost: ticketDataWithoutFiles.estimatedCost || 0,
        actualCost: ticketDataWithoutFiles.actualCost,
        status: ticketDataWithoutFiles.status || RepairStatus.RECEIVED,
        priority: ticketDataWithoutFiles.priority || 'medium',
        grade: ticketDataWithoutFiles.grade,
        gradeNotes: ticketDataWithoutFiles.gradeNotes,
        technicianId: ticketDataWithoutFiles.technicianId,
        images: ticketDataWithoutFiles.images,
        completedAt: ticketDataWithoutFiles.completedAt
      }, filesToUpload);
      
      setTickets(prev => [newTicket, ...prev]);
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<RepairTicket>) => {
    try {
      const { filesToUpload, ...updatesWithoutFiles } = updates as any;
      const updatedTicket = await repairTicketService.update(ticketId, updatesWithoutFiles, filesToUpload);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
    } catch (err) {
      console.error('Error updating ticket:', err);
      throw err;
    }
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      await repairTicketService.delete(ticketId);
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    } catch (err) {
      console.error('Error deleting ticket:', err);
      throw err;
    }
  };

  const createCustomer = async (customerData: Partial<Customer>) => {
    try {
      const newCustomer = await customerService.create({
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || ''
      });
      
      setCustomers(prev => [newCustomer, ...prev]);
    } catch (err) {
      console.error('Error creating customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerService.update(customerId, updates);
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId ? updatedCustomer : customer
      ));
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      await customerService.delete(customerId);
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  return {
    tickets,
    customers,
    technicians,
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshData: loadAllData
  };
};