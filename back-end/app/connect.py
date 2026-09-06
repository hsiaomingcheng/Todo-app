import os
from dotenv import load_dotenv

load_dotenv()

dbuser = os.getenv("DB_USER")
dbpass = os.getenv("DB_PASS")
dbhost = os.getenv("DB_HOST")
dbport = int(os.getenv("DB_PORT", 5432))
dbname = os.getenv("DB_NAME")
