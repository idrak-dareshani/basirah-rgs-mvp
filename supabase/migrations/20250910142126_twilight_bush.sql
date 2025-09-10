/*
  # Create RGS (Repair and Grading System) Database Schema

  1. New Tables
    - `rgs_customers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `address` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rgs_technicians`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `specialties` (text array)
      - `active_tickets` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rgs_repair_tickets`
      - `id` (text, primary key - custom format like RPR-001)
      - `customer_id` (uuid, foreign key to rgs_customers)
      - `device_type` (text, required)
      - `device_model` (text, required)
      - `serial_number` (text, optional)
      - `issue_description` (text, required)
      - `estimated_cost` (decimal, required)
      - `actual_cost` (decimal, optional)
      - `status` (text, enum constraint)
      - `priority` (text, enum constraint)
      - `grade` (text, enum constraint, optional)
      - `grade_notes` (text, optional)
      - `technician_id` (uuid, foreign key to rgs_technicians, optional)
      - `images` (text array, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `completed_at` (timestamp, optional)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
    - Add policies for anonymous users (for demo purposes)

  3. Constraints and Indexes
    - Add check constraints for enums
    - Add indexes for foreign keys and frequently queried columns
    - Add triggers for updated_at timestamps
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS rgs_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS rgs_technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  specialties text[] DEFAULT '{}',
  active_tickets integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create repair tickets table
CREATE TABLE IF NOT EXISTS rgs_repair_tickets (
  id text PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES rgs_customers(id) ON DELETE RESTRICT,
  device_type text NOT NULL,
  device_model text NOT NULL,
  serial_number text,
  issue_description text NOT NULL,
  estimated_cost decimal(10,2) NOT NULL DEFAULT 0,
  actual_cost decimal(10,2),
  status text NOT NULL DEFAULT 'received',
  priority text NOT NULL DEFAULT 'medium',
  grade text,
  grade_notes text,
  technician_id uuid REFERENCES rgs_technicians(id) ON DELETE SET NULL,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Add check constraints for enums
ALTER TABLE rgs_repair_tickets ADD CONSTRAINT rgs_repair_tickets_status_check 
  CHECK (status IN ('received', 'diagnosed', 'in_progress', 'awaiting_parts', 'testing', 'completed', 'ready_for_pickup', 'picked_up', 'cancelled'));

ALTER TABLE rgs_repair_tickets ADD CONSTRAINT rgs_repair_tickets_priority_check 
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE rgs_repair_tickets ADD CONSTRAINT rgs_repair_tickets_grade_check 
  CHECK (grade IN ('excellent', 'good', 'fair', 'poor', 'damaged'));

-- Add other constraints
ALTER TABLE rgs_repair_tickets ADD CONSTRAINT rgs_repair_tickets_estimated_cost_check 
  CHECK (estimated_cost >= 0);

ALTER TABLE rgs_repair_tickets ADD CONSTRAINT rgs_repair_tickets_actual_cost_check 
  CHECK (actual_cost >= 0);

ALTER TABLE rgs_technicians ADD CONSTRAINT rgs_technicians_active_tickets_check 
  CHECK (active_tickets >= 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_customer_id ON rgs_repair_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_technician_id ON rgs_repair_tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_status ON rgs_repair_tickets(status);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_priority ON rgs_repair_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_created_at ON rgs_repair_tickets(created_at);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rgs_customers_updated_at BEFORE UPDATE ON rgs_customers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rgs_technicians_updated_at BEFORE UPDATE ON rgs_technicians 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rgs_repair_tickets_updated_at BEFORE UPDATE ON rgs_repair_tickets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE rgs_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rgs_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE rgs_repair_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Users can view all customers"
  ON rgs_customers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert customers"
  ON rgs_customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update customers"
  ON rgs_customers FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete customers"
  ON rgs_customers FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create policies for technicians
CREATE POLICY "Users can view all technicians"
  ON rgs_technicians FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert technicians"
  ON rgs_technicians FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update technicians"
  ON rgs_technicians FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete technicians"
  ON rgs_technicians FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create policies for repair tickets
CREATE POLICY "Users can view all repair tickets"
  ON rgs_repair_tickets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert repair tickets"
  ON rgs_repair_tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update repair tickets"
  ON rgs_repair_tickets FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete repair tickets"
  ON rgs_repair_tickets FOR DELETE
  TO anon, authenticated
  USING (true);