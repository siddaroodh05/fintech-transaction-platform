import bcrypt

MAX_PIN_BYTES = 72  

def hash_pin(pin: str) -> str:

    truncated_pin = pin[:MAX_PIN_BYTES]  
    hashed = bcrypt.hashpw(truncated_pin.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_pin(pin: str, pin_hash: str) -> bool:
   
    truncated_pin = pin[:MAX_PIN_BYTES]
    return bcrypt.checkpw(truncated_pin.encode('utf-8'), pin_hash.encode('utf-8'))
