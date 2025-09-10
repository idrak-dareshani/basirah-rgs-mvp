/*
  # Seed RGS Database with Sample Data

  1. Sample Data
    - Insert sample customers
    - Insert sample technicians
    - Insert sample repair tickets

  2. Notes
    - This provides initial data for testing and demonstration
    - All data uses realistic values for a repair shop scenario
*/

-- Insert sample customers
INSERT INTO rgs_customers (id, name, email, phone, address) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main St, Anytown, ST 12345'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.j@email.com', '(555) 987-6543', '456 Oak Ave, Somewhere, ST 67890'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mike Chen', 'mike.chen@email.com', '(555) 456-7890', '789 Pine Rd, Elsewhere, ST 54321'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Emily Davis', 'emily.davis@email.com', '(555) 321-9876', '321 Elm St, Nowhere, ST 98765'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Robert Wilson', 'robert.w@email.com', '(555) 654-3210', '654 Maple Ave, Anywhere, ST 13579')
ON CONFLICT (id) DO NOTHING;

-- Insert sample technicians
INSERT INTO rgs_technicians (id, name, email, specialties, active_tickets) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Alex Rodriguez', 'alex@repairshop.com', ARRAY['iPhone', 'Samsung', 'iPad'], 3),
  ('660e8400-e29b-41d4-a716-446655440002', 'Emma Wilson', 'emma@repairshop.com', ARRAY['MacBook', 'Windows Laptop', 'Desktop'], 2),
  ('660e8400-e29b-41d4-a716-446655440003', 'David Kim', 'david@repairshop.com', ARRAY['Gaming Console', 'Tablet', 'Android'], 4),
  ('660e8400-e29b-41d4-a716-446655440004', 'Lisa Garcia', 'lisa@repairshop.com', ARRAY['iPhone', 'iPad', 'Apple Watch'], 1),
  ('660e8400-e29b-41d4-a716-446655440005', 'James Brown', 'james@repairshop.com', ARRAY['Samsung', 'Google Pixel', 'OnePlus'], 2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample repair tickets
INSERT INTO rgs_repair_tickets (
  id, customer_id, device_type, device_model, serial_number, issue_description,
  estimated_cost, actual_cost, status, priority, grade, grade_notes,
  technician_id, created_at, updated_at, completed_at
) VALUES
  (
    'RPR-001',
    '550e8400-e29b-41d4-a716-446655440001',
    'iPhone',
    'iPhone 14 Pro',
    'ABC123456789',
    'Cracked screen, touch not responding in bottom right corner',
    299.99,
    279.99,
    'completed',
    'medium',
    'good',
    'Minor scratches on back, good overall condition',
    '660e8400-e29b-41d4-a716-446655440001',
    '2025-01-15T10:30:00Z',
    '2025-01-17T16:45:00Z',
    '2025-01-17T16:45:00Z'
  ),
  (
    'RPR-002',
    '550e8400-e29b-41d4-a716-446655440002',
    'MacBook',
    'MacBook Pro 16" 2023',
    'MBP987654321',
    'Battery not holding charge, random shutdowns',
    199.99,
    NULL,
    'in_progress',
    'high',
    'excellent',
    'Like new condition, only battery issue',
    '660e8400-e29b-41d4-a716-446655440002',
    '2025-01-16T14:20:00Z',
    '2025-01-17T11:30:00Z',
    NULL
  ),
  (
    'RPR-003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Samsung Galaxy',
    'Galaxy S23 Ultra',
    'SAM456789123',
    'Water damage, phone won''t turn on',
    450.00,
    NULL,
    'diagnosed',
    'urgent',
    'poor',
    'Significant water damage, multiple components affected',
    '660e8400-e29b-41d4-a716-446655440001',
    '2025-01-17T09:00:00Z',
    '2025-01-17T12:15:00Z',
    NULL
  ),
  (
    'RPR-004',
    '550e8400-e29b-41d4-a716-446655440001',
    'iPad',
    'iPad Air 5th Gen',
    'IPAD789123456',
    'Charging port loose, intermittent charging',
    129.99,
    NULL,
    'awaiting_parts',
    'low',
    'fair',
    'Some wear on edges, overall functional',
    '660e8400-e29b-41d4-a716-446655440003',
    '2025-01-17T15:45:00Z',
    '2025-01-17T16:20:00Z',
    NULL
  ),
  (
    'RPR-005',
    '550e8400-e29b-41d4-a716-446655440004',
    'Google Pixel',
    'Pixel 8 Pro',
    'PIX321654987',
    'Camera app crashes, rear camera not working',
    175.00,
    NULL,
    'received',
    'medium',
    'good',
    'Minor cosmetic wear, camera module issue',
    NULL,
    '2025-01-18T09:30:00Z',
    '2025-01-18T09:30:00Z',
    NULL
  )
ON CONFLICT (id) DO NOTHING;