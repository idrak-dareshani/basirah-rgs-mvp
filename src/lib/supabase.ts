import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      rgs_customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      rgs_technicians: {
        Row: {
          id: string;
          name: string;
          email: string;
          specialties: string[];
          active_tickets: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          specialties?: string[];
          active_tickets?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          specialties?: string[];
          active_tickets?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      rgs_repair_tickets: {
        Row: {
          id: string;
          customer_id: string;
          device_type: string;
          device_model: string;
          serial_number: string | null;
          issue_description: string;
          estimated_cost: number;
          actual_cost: number | null;
          status: string;
          priority: string;
          grade: string | null;
          grade_notes: string | null;
          technician_id: string | null;
          images: string[];
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id: string;
          customer_id: string;
          device_type: string;
          device_model: string;
          serial_number?: string | null;
          issue_description: string;
          estimated_cost: number;
          actual_cost?: number | null;
          status?: string;
          priority?: string;
          grade?: string | null;
          grade_notes?: string | null;
          technician_id?: string | null;
          images?: string[];
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          device_type?: string;
          device_model?: string;
          serial_number?: string | null;
          issue_description?: string;
          estimated_cost?: number;
          actual_cost?: number | null;
          status?: string;
          priority?: string;
          grade?: string | null;
          grade_notes?: string | null;
          technician_id?: string | null;
          images?: string[];
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
}