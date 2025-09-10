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
      const newTicket = await repairTicketService.create({
        customerId: ticketData.customerId || '',
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
        images: ticketData.images,
        completedAt: ticketData.completedAt
      });
      
      setTickets(prev => [newTicket, ...prev]);
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<RepairTicket>) => {
    try {
      const updatedTicket = await repairTicketService.update(ticketId, updates);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
    } catch (err) {
      console.error('Error updating ticket:', err);
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

  return {
    tickets,
    customers,
    technicians,
    loading,
    error,
    createTicket,
    updateTicket,
    createCustomer,
    updateCustomer,
    refreshData: loadAllData
  };
};