import { supabase } from '../lib/supabase';
import { Technician } from '../types';

export const technicianService = {
  async getAll(): Promise<Technician[]> {
    const { data, error } = await supabase
      .from('rgs_technicians')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching technicians:', error);
      throw error;
    }

    return data.map(tech => ({
      id: tech.id,
      name: tech.name,
      email: tech.email,
      specialties: tech.specialties,
      activeTickets: tech.active_tickets
    }));
  },

  async create(technicianData: Omit<Technician, 'id' | 'activeTickets'>): Promise<Technician> {
    const { data, error } = await supabase
      .from('rgs_technicians')
      .insert({
        name: technicianData.name,
        email: technicianData.email,
        specialties: technicianData.specialties
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating technician:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      specialties: data.specialties,
      activeTickets: data.active_tickets
    };
  },

  async update(id: string, updates: Partial<Omit<Technician, 'id'>>): Promise<Technician> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.specialties !== undefined) updateData.specialties = updates.specialties;
    if (updates.activeTickets !== undefined) updateData.active_tickets = updates.activeTickets;

    const { data, error } = await supabase
      .from('rgs_technicians')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating technician:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      specialties: data.specialties,
      activeTickets: data.active_tickets
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rgs_technicians')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting technician:', error);
      throw error;
    }
  }
};