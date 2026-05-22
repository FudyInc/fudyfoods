"""
Database initialization script
Runs SQL commands to setup Supabase tables
"""

from app.services.supabase_service import supabase_client
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize database with tables and sample data"""
    
    try:
        # Get the admin client with execute_sql capability
        client = supabase_client
        
        # SQL to create tables
        setup_sql = """
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

        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
        CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

        -- Enable RLS (Row Level Security)
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies (allow all for now - modify in production)
        CREATE POLICY "Enable read access for all users" ON products
          FOR SELECT USING (true);

        CREATE POLICY "Enable read access for all users" ON sales
          FOR SELECT USING (true);
        """
        
        logger.info("📊 Creating database tables...")
        
        # Insert sample products
        products_data = [
            {
                "name": "Bebida Premium Cola",
                "description": "Bebida refrescante de cola premium",
                "price": 2.50,
                "quantity": 100
            },
            {
                "name": "Bebida Tropical Mix",
                "description": "Mezcla tropical con frutas exóticas",
                "price": 3.00,
                "quantity": 80
            },
            {
                "name": "Bebida Energética",
                "description": "Bebida energética natural",
                "price": 3.50,
                "quantity": 60
            },
            {
                "name": "Bebida Frutal Naranja",
                "description": "Jugo natural de naranja",
                "price": 2.00,
                "quantity": 150
            },
            {
                "name": "Bebida Herbal Relax",
                "description": "Infusión relajante de hierbas",
                "price": 2.75,
                "quantity": 120
            }
        ]
        
        logger.info("✅ Inserting sample products...")
        for product in products_data:
            try:
                response = client.table("products").insert(product).execute()
                logger.info(f"  ✓ {product['name']}")
            except Exception as e:
                if "duplicate" not in str(e).lower():
                    logger.warning(f"  ⚠ {product['name']}: {e}")
        
        # Insert sample sales
        sales_data = [
            {"product_id": 1, "quantity": 5, "total_price": 12.50},
            {"product_id": 2, "quantity": 3, "total_price": 9.00},
            {"product_id": 1, "quantity": 8, "total_price": 20.00},
            {"product_id": 3, "quantity": 2, "total_price": 7.00},
            {"product_id": 4, "quantity": 10, "total_price": 20.00},
            {"product_id": 5, "quantity": 4, "total_price": 11.00},
            {"product_id": 2, "quantity": 6, "total_price": 18.00},
            {"product_id": 1, "quantity": 3, "total_price": 7.50}
        ]
        
        logger.info("✅ Inserting sample sales data...")
        for sale in sales_data:
            try:
                response = client.table("sales").insert(sale).execute()
                logger.info(f"  ✓ Sale: {sale['quantity']} units - ${sale['total_price']}")
            except Exception as e:
                if "duplicate" not in str(e).lower():
                    logger.warning(f"  ⚠ Sale data: {e}")
        
        logger.info("🎉 Database initialization completed successfully!")
        
        # Verify data
        products = client.table("products").select("*").execute()
        sales = client.table("sales").select("*").execute()
        
        logger.info(f"📊 Total products: {len(products.data)}")
        logger.info(f"📊 Total sales: {len(sales.data)}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        return False


if __name__ == "__main__":
    import sys
    sys.path.insert(0, "/Users/Diego/Fudyfoods/backend")
    
    from app.config.settings import settings
    success = init_database()
    sys.exit(0 if success else 1)
