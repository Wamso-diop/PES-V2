from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    resend_api_key: str = ""
    admin_email: str = "admin@pes-douala.cm"
    cors_origins: str = "http://localhost:3000"
    admin_invite_code: str = "PES-ADMIN-2026"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
