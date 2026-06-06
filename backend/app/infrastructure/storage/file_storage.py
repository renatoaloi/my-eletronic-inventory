from pathlib import Path
from app.config import STORAGE_PATH


class FileStorage:
    def __init__(self, base_path: Path = STORAGE_PATH):
        self.base_path = base_path

    def save(self, subfolder: str, file_name: str, content: bytes) -> str:
        folder = self.base_path / subfolder
        folder.mkdir(parents=True, exist_ok=True)
        file_path = folder / file_name
        with open(str(file_path), "wb") as f:
            f.write(content)
        return str(file_path)

    def delete(self, file_path: str) -> bool:
        path = Path(file_path)
        if path.exists():
            path.unlink()
            return True
        return False

    def get_full_path(self, subfolder: str, file_name: str) -> str:
        return str(self.base_path / subfolder / file_name)
