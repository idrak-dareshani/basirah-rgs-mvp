import { supabase } from '../lib/supabase';
import { Customer } from '../types';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('rgs_customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.created_at
    }));
  },

  async create(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('rgs_customers')
      .insert({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      createdAt: data.created_at
    };
  },

  async update(id: string, updates: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<Customer> {
    const { data, error } = await supabase
      .from('rgs_customers')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        address: updates.address
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      createdAt: data.created_at
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rgs_customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};
