"""
Fudyfoods Dashboard Backend - FastAPI Application
Professional dashboard with autonomous AI agents
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api import health, products, analytics
import logging

# Configure logging
logging.basicConfig(level=settings.log_level.upper())
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Fudyfoods Dashboard API",
    description="Professional dashboard for Fudyfoods with AI agents",
    version="0.1.0",
    debug=settings.debug,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(health.router)
app.include_router(products.router)
app.include_router(analytics.router)


@app.on_event("startup")
async def startup_event():
    """Startup event"""
    logger.info("🚀 Fudyfoods API starting up...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug: {settings.debug}")
    logger.info(f"Supabase connected: {settings.supabase_url}")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event"""
    logger.info("🛑 Fudyfoods API shutting down...")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level,
    )
