import { supabase } from '../lib/supabase';
import { RepairTicket, RepairStatus } from '../types';

export const repairTicketService = {
  async getAll(): Promise<RepairTicket[]> {
    const { data, error } = await supabase
      .from('rgs_repair_tickets')
      .select(`
        *,
        customer:rgs_customers(name),
        technician:rgs_technicians(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repair tickets:', error);
      throw error;
    }

    return data.map(ticket => ({
      id: ticket.id,
      customerId: ticket.customer_id,
      customerName: ticket.customer?.name || 'Unknown Customer',
      deviceType: ticket.device_type,
      deviceModel: ticket.device_model,
      serialNumber: ticket.serial_number,
      issueDescription: ticket.issue_description,
      estimatedCost: ticket.estimated_cost,
      actualCost: ticket.actual_cost,
      status: ticket.status as RepairStatus,
      priority: ticket.priority as any,
      grade: ticket.grade as any,
      gradeNotes: ticket.grade_notes,
      technicianId: ticket.technician_id,
      technicianName: ticket.technician?.name,
      images: ticket.images,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      completedAt: ticket.completed_at
    }));
  },

  async create(ticketData: Omit<RepairTicket, 'id' | 'customerName' | 'technicianName' | 'createdAt' | 'updatedAt'>): Promise<RepairTicket> {
    // Generate next ticket ID
    const { data: lastTicket } = await supabase
      .from('rgs_repair_tickets')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (lastTicket && lastTicket.length > 0) {
      const lastId = lastTicket[0].id;
      const lastNumber = parseInt(lastId.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    const newId = `RPR-${String(nextNumber).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('rgs_repair_tickets')
      .insert({
        id: newId,
        customer_id: ticketData.customerId,
        device_type: ticketData.deviceType,
        device_model: ticketData.deviceModel,
        serial_number: ticketData.serialNumber,
        issue_description: ticketData.issueDescription,
        estimated_cost: ticketData.estimatedCost,
        actual_cost: ticketData.actualCost,
        status: ticketData.status,
        priority: ticketData.priority,
        grade: ticketData.grade,
        grade_notes: ticketData.gradeNotes,
        technician_id: ticketData.technicianId,
        images: ticketData.images || [],
        completed_at: ticketData.completedAt
      })
      .select(`
        *,
        customer:rgs_customers(name),
        technician:rgs_technicians(name)
      `)
      .single();

    if (error) {
      console.error('Error creating repair ticket:', error);
      throw error;
    }

    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer?.name || 'Unknown Customer',
      deviceType: data.device_type,
      deviceModel: data.device_model,
      serialNumber: data.serial_number,
      issueDescription: data.issue_description,
      estimatedCost: data.estimated_cost,
      actualCost: data.actual_cost,
      status: data.status as RepairStatus,
      priority: data.priority as any,
      grade: data.grade as any,
      gradeNotes: data.grade_notes,
      technicianId: data.technician_id,
      technicianName: data.technician?.name,
      images: data.images,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      completedAt: data.completed_at
    };
  },

  async update(id: string, updates: Partial<RepairTicket>): Promise<RepairTicket> {
    const updateData: any = {};
    
    if (updates.customerId !== undefined) updateData.customer_id = updates.customerId;
    if (updates.deviceType !== undefined) updateData.device_type = updates.deviceType;
    if (updates.deviceModel !== undefined) updateData.device_model = updates.deviceModel;
    if (updates.serialNumber !== undefined) updateData.serial_number = updates.serialNumber;
    if (updates.issueDescription !== undefined) updateData.issue_description = updates.issueDescription;
    if (updates.estimatedCost !== undefined) updateData.estimated_cost = updates.estimatedCost;
    if (updates.actualCost !== undefined) updateData.actual_cost = updates.actualCost;
    if (updates.status !== undefined) {
      updateData.status = updates.status;
      // Set completed_at when status changes to completed
      if (updates.status === RepairStatus.COMPLETED) {
        updateData.completed_at = new Date().toISOString();
      }
    }
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.grade !== undefined) updateData.grade = updates.grade;
    if (updates.gradeNotes !== undefined) updateData.grade_notes = updates.gradeNotes;
    if (updates.technicianId !== undefined) updateData.technician_id = updates.technicianId;
    if (updates.images !== undefined) updateData.images = updates.images;

    const { data, error } = await supabase
      .from('rgs_repair_tickets')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        customer:rgs_customers(name),
        technician:rgs_technicians(name)
      `)
      .single();

    if (error) {
      console.error('Error updating repair ticket:', error);
      throw error;
    }

    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer?.name || 'Unknown Customer',
      deviceType: data.device_type,
      deviceModel: data.device_model,
      serialNumber: data.serial_number,
      issueDescription: data.issue_description,
      estimatedCost: data.estimated_cost,
      actualCost: data.actual_cost,
      status: data.status as RepairStatus,
      priority: data.priority as any,
      grade: data.grade as any,
      gradeNotes: data.grade_notes,
      technicianId: data.technician_id,
      technicianName: data.technician?.name,
      images: data.images,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      completedAt: data.completed_at
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rgs_repair_tickets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting repair ticket:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rgs_repair_tickets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting repair ticket:', error);
      throw error;
    }
  }
};