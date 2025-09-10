/*
  # Seed Sample Data for Repair System

  1. Sample Data
    - Add sample customers
    - Add sample technicians
    - Add sample repair tickets with relationships

  2. Notes
    - This provides initial data for testing and demonstration
    - All data uses realistic examples for a repair shop
*/

-- Insert sample customers
INSERT INTO rgs_customers (id, name, email, phone, address) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main St, Anytown, ST 12345'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.j@email.com', '(555) 234-5678', '456 Oak Ave, Somewhere, ST 67890'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mike Davis', 'mike.davis@email.com', '(555) 345-6789', '789 Pine Rd, Elsewhere, ST 54321'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Emily Wilson', 'emily.w@email.com', '(555) 456-7890', '321 Elm St, Nowhere, ST 98765'),
  ('550e8400-e29b-41d4-a716-446655440005', 'David Brown', 'david.brown@email.com', '(555) 567-8901', '654 Maple Dr, Anywhere, ST 13579')
ON CONFLICT (id) DO NOTHING;

-- Insert sample technicians
INSERT INTO rgs_technicians (id, name, email, specialties, active_tickets) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Alex Rodriguez', 'alex.r@repairshop.com', '{"smartphones", "tablets", "laptops"}', 3),
  ('660e8400-e29b-41d4-a716-446655440002', 'Maria Garcia', 'maria.g@repairshop.com', '{"gaming consoles", "computers", "electronics"}', 2),
  ('660e8400-e29b-41d4-a716-446655440003', 'James Wilson', 'james.w@repairshop.com', '{"appliances", "power tools", "electronics"}', 1),
  ('660e8400-e29b-41d4-a716-446655440004', 'Lisa Chen', 'lisa.c@repairshop.com', '{"smartphones", "wearables", "audio equipment"}', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert sample repair tickets
INSERT INTO rgs_repair_tickets (
  id, customer_id, device_type, device_model, serial_number, issue_description,
  estimated_cost, actual_cost, status, priority, grade, grade_notes,
  technician_id, images, completed_at
) VALUES
  (
    'RPR-001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Smartphone',
    'iPhone 14 Pro',
    'F2LLD3XHQG',
    'Cracked screen, touch not responding in bottom right corner',
    299.99,
    289.99,
    'completed',
    'high',
    'good',
    'Device was in good condition overall, just needed screen replacement',
    '660e8400-e29b-41d4-a716-446655440001',
    '{}',
    now() - interval '2 days'
  ),
  (
    'RPR-002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Laptop',
    'MacBook Air M2',
    'C02ZK1XHMD6T',
    'Battery not holding charge, shuts down randomly',
    199.99,
    NULL,
    'in_progress',
    'medium',
    NULL,
    NULL,
    '660e8400-e29b-41d4-a716-446655440001',
    '{}',
    NULL
  ),
  (
    'RPR-003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Gaming Console',
    'PlayStation 5',
    'PS5-2023-ABC123',
    'Console overheating and making loud fan noise',
    149.99,
    NULL,
    'diagnosed',
    'medium',
    'fair',
    'Significant dust buildup, thermal paste needs replacement',
    '660e8400-e29b-41d4-a716-446655440002',
    '{}',
    NULL
  ),
  (
    'RPR-004',
    '550e8400-e29b-41d4-a716-446655440004',
    'Tablet',
    'iPad Pro 12.9"',
    'DMPH2LL/A',
    'Water damage, won''t turn on',
    399.99,
    NULL,
    'waiting_parts',
    'low',
    'poor',
    'Extensive water damage, multiple components affected',
    '660e8400-e29b-41d4-a716-446655440004',
    '{}',
    NULL
  ),
  (
    'RPR-005',
    '550e8400-e29b-41d4-a716-446655440005',
    'Smartphone',
    'Samsung Galaxy S23',
    'RF8M123ABCD',
    'Charging port loose, intermittent charging',
    89.99,
    NULL,
    'received',
    'medium',
    NULL,
    NULL,
    NULL,
    '{}',
    NULL
  )
ON CONFLICT (id) DO NOTHING;