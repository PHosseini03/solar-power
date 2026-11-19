"""Runtime configuration loaded from environment variables."""
import os
from dataclasses import dataclass, field


def _split(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    site_name: str = "HelioGrid Solar"
    allowed_origins: list[str] = field(
        default_factory=lambda: _split(
            os.getenv("ALLOWED_ORIGINS", "http://localhost:5171,http://127.0.0.1:5171")
        )
    )
    database_path: str = os.getenv("DATABASE_PATH", "data/demo.db")
    rate_limit: str = os.getenv("RATE_LIMIT", "10/minute")
    max_body_bytes: int = 16_384


settings = Settings()
