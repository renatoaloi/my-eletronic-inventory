import os
from pathlib import Path

API_KEY: str = os.getenv("API_KEY", "my-secret-api-key")
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///../storage/database.db")
PORT: int = int(os.getenv("PORT", "8000"))
STORAGE_PATH: Path = Path(os.getenv("STORAGE_PATH", "../storage"))
