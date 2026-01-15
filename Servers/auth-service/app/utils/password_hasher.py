from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MAX_BCRYPT_LENGTH = 72 


def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')[:MAX_BCRYPT_LENGTH]
    password_truncated = password_bytes.decode('utf-8', errors='ignore')  
    return pwd_context.hash(password_truncated)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')[:MAX_BCRYPT_LENGTH]
    password_truncated = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.verify(password_truncated, hashed_password)
