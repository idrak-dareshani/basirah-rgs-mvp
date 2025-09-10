/*
  # Create Repair and Grading System Tables

  1. New Tables
    - `rgs_customers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `address` (text, not null)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    
    - `rgs_technicians`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `specialties` (text array, default empty)
      - `active_tickets` (integer, default 0)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    
    - `rgs_repair_tickets`
      - `id` (text, primary key, format: RPR-001)
      - `customer_id` (uuid, foreign key to rgs_customers)
      - `device_type` (text, not null)
      - `device_model` (text, not null)
      - `serial_number` (text, nullable)
      - `issue_description` (text, not null)
      - `estimated_cost` (numeric, not null, >= 0)
      - `actual_cost` (numeric, nullable, >= 0)
      - `status` (text, enum: received, diagnosed, in_progress, waiting_parts, completed, cancelled)
      - `priority` (text, enum: low, medium, high, urgent)
      - `grade` (text, enum: excellent, good, fair, poor, nullable)
      - `grade_notes` (text, nullable)
      - `technician_id` (uuid, foreign key to rgs_technicians, nullable)
      - `images` (text array, default empty)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
      - `completed_at` (timestamptz, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous users to perform all operations
    
  3. Triggers
    - Add updated_at triggers for all tables
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
  active_tickets integer DEFAULT 0 CHECK (active_tickets >= 0),
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
  estimated_cost numeric NOT NULL CHECK (estimated_cost >= 0),
  actual_cost numeric CHECK (actual_cost >= 0),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'diagnosed', 'in_progress', 'waiting_parts', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  grade text CHECK (grade IN ('excellent', 'good', 'fair', 'poor')),
  grade_notes text,
  technician_id uuid REFERENCES rgs_technicians(id) ON DELETE SET NULL,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rgs_customers_updated_at
  BEFORE UPDATE ON rgs_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rgs_technicians_updated_at
  BEFORE UPDATE ON rgs_technicians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rgs_repair_tickets_updated_at
  BEFORE UPDATE ON rgs_repair_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE rgs_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rgs_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE rgs_repair_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Allow all operations for authenticated users on customers"
  ON rgs_customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for anonymous users on customers"
  ON rgs_customers
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create policies for technicians
CREATE POLICY "Allow all operations for authenticated users on technicians"
  ON rgs_technicians
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for anonymous users on technicians"
  ON rgs_technicians
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create policies for repair tickets
CREATE POLICY "Allow all operations for authenticated users on repair tickets"
  ON rgs_repair_tickets
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for anonymous users on repair tickets"
  ON rgs_repair_tickets
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_customer_id ON rgs_repair_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_technician_id ON rgs_repair_tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_status ON rgs_repair_tickets(status);
CREATE INDEX IF NOT EXISTS idx_rgs_repair_tickets_created_at ON rgs_repair_tickets(created_at);