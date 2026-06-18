from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
import datetime

app = FastAPI(title="shop-service")

class Product(BaseModel):
    id: str
    title: str
    description: str
    price: float
    imageUrl: str
    category: str
    rating: float
    reviewsCount: int
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None

class CartItem(BaseModel):
    id: str
    product: Product
    quantity: int
    selectedSize: Optional[str] = None
    selectedColor: Optional[str] = None

class OrderRequest(BaseModel):
    items: List[CartItem]
    total: float
    # In real app we'd have shipping info here

class OrderResponse(BaseModel):
    id: str
    items: List[CartItem]
    total: float
    status: str
    createdAt: str

MOCK_PRODUCTS = [
    {
        "id": "p1",
        "title": "Pro Tennis Racket",
        "description": "High-performance graphite tennis racket for competitive play. Lightweight and durable.",
        "price": 199.99,
        "imageUrl": "https://images.unsplash.com/photo-1622279457486-69d73ce184fc?w=800&auto=format&fit=crop&q=60",
        "category": "Equipment",
        "rating": 4.8,
        "reviewsCount": 124,
        "sizes": ["Grip 2", "Grip 3", "Grip 4"],
    },
    {
        "id": "p2",
        "title": "Performance Running Shoes",
        "description": "Ultra-lightweight running shoes with responsive cushioning for your daily miles.",
        "price": 129.99,
        "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
        "category": "Apparel",
        "rating": 4.6,
        "reviewsCount": 342,
        "sizes": ["US 8", "US 9", "US 10", "US 11"],
        "colors": ["Red", "Black", "White"],
    },
    {
        "id": "p3",
        "title": "Yoga Mat Premium",
        "description": "Eco-friendly, non-slip yoga mat with alignment lines. 5mm thickness for extra comfort.",
        "price": 49.99,
        "imageUrl": "https://images.unsplash.com/photo-1608331307049-d7ee76742a03?w=800&auto=format&fit=crop&q=60",
        "category": "Accessories",
        "rating": 4.9,
        "reviewsCount": 89,
        "colors": ["Purple", "Teal", "Charcoal"],
    },
    {
        "id": "p4",
        "title": "Whey Protein Isolate",
        "description": "Fast-absorbing whey protein isolate to support muscle recovery. 25g protein per scoop.",
        "price": 54.99,
        "imageUrl": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=60",
        "category": "Nutrition",
        "rating": 4.7,
        "reviewsCount": 512,
    },
    {
        "id": "p5",
        "title": "Smart Fitness Watch",
        "description": "Track your workouts, heart rate, and sleep with this advanced fitness smartwatch.",
        "price": 249.99,
        "imageUrl": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
        "category": "Accessories",
        "rating": 4.5,
        "reviewsCount": 215,
        "colors": ["Black", "Silver"],
    },
    {
        "id": "p6",
        "title": "Breathable Training Tee",
        "description": "Moisture-wicking training t-shirt that keeps you cool during intense workouts.",
        "price": 29.99,
        "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
        "category": "Apparel",
        "rating": 4.4,
        "reviewsCount": 156,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Navy", "Grey", "White"],
    }
]

@app.get("/")
def read_root():
    return {"message": "Welcome to Shop Service"}

@app.get("/api/products", response_model=List[Product])
def get_products():
    return MOCK_PRODUCTS

@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/orders", response_model=OrderResponse)
def place_order(order: OrderRequest):
    order_id = f"ORD-{str(uuid.uuid4())[:8].upper()}"
    return OrderResponse(
        id=order_id,
        items=order.items,
        total=order.total,
        status="pending",
        createdAt=datetime.datetime.utcnow().isoformat() + "Z"
    )
