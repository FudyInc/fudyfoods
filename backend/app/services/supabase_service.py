"""Supabase database service"""

from supabase import create_client, Client
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseService:
    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client (singleton pattern)"""
        if cls._instance is None:
            try:
                cls._instance = create_client(
                    supabase_url=settings.supabase_url,
                    supabase_key=settings.supabase_key,
                )
                logger.info("✅ Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"❌ Error initializing Supabase: {e}")
                raise

        return cls._instance

    @classmethod
    def query(cls, table: str):
        """Query a table"""
        client = cls.get_client()
        return client.table(table)


# Initialize client on import
supabase_client = SupabaseService.get_client()
