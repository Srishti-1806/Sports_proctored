from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
import logging

# Logging set karein taaki errors terminal mein saaf dikhein
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------ MongoDB Setup (Async) ------------------
# Semicolon hata diya hai aur connection pool setup kar diya hai
MONGO_URI = "mongodb+srv://srishtiMis:srishtiatnsut@cluster0.rxik0m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["sports_proctor"]
    scores_collection = db["scores"]
    logger.info("✅ Motor Client Initialized")
except Exception as e:
    logger.error(f"❌ MongoDB Connection Error: {e}")

# ------------------ FastAPI Setup ------------------
app = FastAPI(title="Sports Proctor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScoreRequest(BaseModel):
    name: str
    score: float

# ------------------ Routes ------------------

@app.get("/")
async def home():
    return {"status": "server online", "api": "sports_proctor"}

@app.post("/score")
async def save_score(data: ScoreRequest):
    try:
        # Pydantic model ko dict mein convert karke save karein
        entry = data.dict()
        await scores_collection.insert_one(entry)
        logger.info(f"Saved score for {data.name}")
        # _id ko remove karein return karne se pehle kyunki woh JSON serializable nahi hota
        if "_id" in entry: del entry["_id"]
        return {"message": "Score saved!", "data": entry}
    except Exception as e:
        logger.error(f"Save error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leaderboard")
async def leaderboard(limit: int = 20):
    try:
        cursor = scores_collection.find({}, {"_id": 0}).sort("score", -1).limit(limit)
        top_scores = await cursor.to_list(length=limit)
        return {"leaderboard": top_scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/{name}")
async def get_user_scores(name: str):
    try:
        cursor = scores_collection.find({"name": name}, {"_id": 0}).sort("score", -1)
        records = await cursor.to_list(length=100)
        return {"name": name, "scores": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------ Entry Point ------------------
if __name__ == "__main__":
    # Ensure karein ki file ka naam 'main.py' hi hai
    print("🚀 Starting server on http://127.0.0.1:8000")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
