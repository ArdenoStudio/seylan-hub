from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Seylan gateway
    seylan_gateway_default: str = "https://dev.apigateway1.seylan.lk:2260"
    seylan_gateway_qr: str = "https://dev.apigateway1.seylan.lk:2250"
    seylan_api_key: str = ""
    seylan_checksum_key_merchant: str = ""
    seylan_checksum_key_lankaqr: str = ""
    seylan_justpay_code: str = "6289_M001_001"

    # Merchant QR (bank-provisioned)
    seylan_merchant_institution_id: str = "1"
    seylan_merchant_channel_user_id: str = ""
    seylan_merchant_channel_pass: str = ""
    seylan_merchant_login_id: str = ""
    seylan_merchant_login_pass: str = ""
    seylan_merchant_mid: str = ""
    seylan_merchant_tid: str = ""

    # Feature flags
    use_seylan_real: bool = False
    seylan_enable_transfers: bool = False
    seylan_enable_merchant_qr: bool = False

    # Hackathon sandbox internal-transfer test accounts (override via env)
    seylan_sandbox_source_account: str = "064000012548001"
    seylan_sandbox_destination_account: str = "001213437904100"

    # AI
    groq_api_key: str = ""
    elevenlabs_api_key: str = ""
    elevenlabs_voice_id: str = "EXAVITQu4vr4xnSDxMaL"

    # Supabase
    supabase_url: str = ""
    supabase_service_key: str = ""

    # App
    cors_origins: str = "http://localhost:3000,https://seylan-hub.vercel.app"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
