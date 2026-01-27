import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import tasks  # <- import tasks router specifically
from src import db  # <- import db module

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await db.create_db_and_tables()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    yield

app = FastAPI(title="Todo API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose authorization header to frontend
    expose_headers=["Authorization"]
)

app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Todo API Running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
