"""Health check endpoints"""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Fudyfoods API is running"}


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Fudyfoods Dashboard API",
        "version": "0.1.0",
        "docs": "/docs",
    }
