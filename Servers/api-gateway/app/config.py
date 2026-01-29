from dotenv import load_dotenv
import os

load_dotenv()

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL")
ACCOUNT_SERVICE_URL = os.getenv("ACCOUNT_SERVICE_URL")
TRANSACTION_SERVICE_URL = os.getenv("TRANSACTION_SERVICE_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

