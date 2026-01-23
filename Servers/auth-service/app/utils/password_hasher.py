import bcrypt

MAX_BCRYPT_LENGTH = 72 


def hash_password(password: str) -> str:
    
    password_bytes = password.encode('utf-8')[:MAX_BCRYPT_LENGTH]
   
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')[:MAX_BCRYPT_LENGTH]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
