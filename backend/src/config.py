from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database settings
    neon_db_url: str = ""
    database_url: str = ""
    # Authentication settings
    better_auth_secret: str = ""
    better_auth_url: Optional[str] = "http://localhost:3000"
    # AI/ML services
    cohere_api_key: str = ""
    # Application settings
    debug: str = "false"  # Keep as string and convert as needed
    log_level: str = "info"

    @property
    def database_url_resolved(self) -> str:
        """Return the database URL, preferring neon_db_url if available."""
        return self.neon_db_url or self.database_url

    class Config:
        env_file = ".env"
        env_prefix = ""
        arbitrary_types_allowed = True


# Create a single instance of settings
settings = Settings()