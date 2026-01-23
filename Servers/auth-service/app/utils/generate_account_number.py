from nanoid import generate

def generate_account_number() -> str:
 
    return generate("0123456789", 12)
