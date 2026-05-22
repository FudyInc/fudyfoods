from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""

    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_anon_key: str

    # OpenAI
    openai_api_key: str

    # FastAPI
    environment: str = "development"
    debug: bool = True
    log_level: str = "info"

    # URLs
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"

    # CORS
    cors_origins: list = ["http://localhost:3000", "http://localhost:8000"]

    class Config:
        env_file = ".env.local"
        case_sensitive = False


settings = Settings()
