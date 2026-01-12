from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

items_db = [
    {"name": "Laptop", "price": 50000},
    {"name": "Mobile", "price": 20000},
    {"name": "Headphones", "price": 3000}
]


@app.get("/items")
def read_item():
    return { "item": items_db}
