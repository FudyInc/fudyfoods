"""Analytics endpoints"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import AnalyticsResponse
from app.services.supabase_service import supabase_client

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=AnalyticsResponse)
async def get_dashboard_analytics():
    """Get dashboard analytics"""
    try:
        # Query sales data
        sales_data = supabase_client.table("sales").select("*").execute()
        
        if not sales_data.data:
            return {
                "total_sales": 0,
                "total_products_sold": 0,
                "average_order_value": 0,
                "top_products": [],
            }

        # Calculate metrics
        total_sales = sum(item["total_price"] for item in sales_data.data)
        total_products_sold = sum(item["quantity"] for item in sales_data.data)
        average_order_value = (
            total_sales / len(sales_data.data) if sales_data.data else 0
        )

        # Get top products
        top_products = sorted(
            sales_data.data, key=lambda x: x["quantity"], reverse=True
        )[:5]

        return {
            "total_sales": total_sales,
            "total_products_sold": total_products_sold,
            "average_order_value": average_order_value,
            "top_products": top_products,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sales-trend")
async def get_sales_trend():
    """Get sales trend over time"""
    try:
        sales_data = supabase_client.table("sales").select("*").execute()
        
        # Group by date and sum
        trend_data = {}
        for sale in sales_data.data:
            date = sale["created_at"][:10]  # Extract date part
            trend_data[date] = trend_data.get(date, 0) + sale["total_price"]

        return {"trend": trend_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
