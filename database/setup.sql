-- ============================================
-- SUPABASE DATABASE SETUP FOR FUDYFOODS
-- ============================================
-- Copy and paste this entire script in Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for read access (permissive for development)
CREATE POLICY "Enable read for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON sales
  FOR SELECT USING (true);

-- Insert sample product data
INSERT INTO products (name, description, price, quantity) VALUES
  ('Bebida Premium Cola', 'Bebida refrescante de cola premium', 2.50, 100),
  ('Bebida Tropical Mix', 'Mezcla tropical con frutas exóticas', 3.00, 80),
  ('Bebida Energética', 'Bebida energética natural', 3.50, 60),
  ('Bebida Frutal Naranja', 'Jugo natural de naranja', 2.00, 150),
  ('Bebida Herbal Relax', 'Infusión relajante de hierbas', 2.75, 120)
ON CONFLICT DO NOTHING;

-- Insert sample sales data
INSERT INTO sales (product_id, quantity, total_price) VALUES
  (1, 5, 12.50),
  (2, 3, 9.00),
  (1, 8, 20.00),
  (3, 2, 7.00),
  (4, 10, 20.00),
  (5, 4, 11.00),
  (2, 6, 18.00),
  (1, 3, 7.50)
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_sales FROM sales;
SELECT SUM(total_price) as total_revenue FROM sales;
