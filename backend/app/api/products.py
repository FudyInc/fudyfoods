"""Product endpoints"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Product, ProductCreate, ProductBase
from app.services.supabase_service import supabase_client

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[Product])
async def get_products():
    """Get all products"""
    try:
        data = supabase_client.table("products").select("*").execute()
        return data.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a specific product"""
    try:
        data = supabase_client.table("products").select("*").eq("id", product_id).execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    try:
        data = supabase_client.table("products").insert(product.dict()).execute()
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: int, product: ProductCreate):
    """Update a product"""
    try:
        data = (
            supabase_client.table("products")
            .update(product.dict())
            .eq("id", product_id)
            .execute()
        )
        if not data.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{product_id}")
async def delete_product(product_id: int):
    """Delete a product"""
    try:
        supabase_client.table("products").delete().eq("id", product_id).execute()
        return {"message": "Product deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
