import string, secrets
from zoneinfo import ZoneInfo
from datetime import datetime

# ID / Reference Generators

def generate_attempt_ref() -> str:
    """Generate a 16-character alphanumeric reference ID."""
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(16))

def generate_transaction_id() -> str:
    return "TXN" + secrets.token_hex(6).upper()


# Timezone Utilities

IST = ZoneInfo("Asia/Kolkata")
UTC = ZoneInfo("UTC")

def to_ist(dt: datetime | None) -> str | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UTC)  
    return dt.astimezone(IST).isoformat()

def to_naive_utc(ts: str) -> datetime:
    dt = datetime.fromisoformat(ts)
    if dt.tzinfo:
        dt = dt.astimezone(UTC)
    return dt.replace(tzinfo=None)


# Account Utilities

def mask_account_number(account_number: str) -> str:
    if not account_number:
        return "XXXXXXXX0000"
    last_four = account_number[-4:] if len(account_number) >= 4 else account_number.zfill(4)
    return f"XXXXXXXX{last_four}"
