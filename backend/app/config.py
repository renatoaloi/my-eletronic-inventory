import os
from pathlib import Path

API_KEY: str = os.getenv("API_KEY", "my-secret-api-key")
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_DATABASE_URL: str = os.getenv("SUPABASE_DATABASE_URL", "")
DATABASE_URL: str = SUPABASE_DATABASE_URL or os.getenv("DATABASE_URL", "sqlite:///../storage/database.db")
PORT: int = int(os.getenv("PORT", "8000"))
STORAGE_PATH: Path = Path(os.getenv("STORAGE_PATH", "../storage"))
