from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MongoDB Atlas Connection ---
MONGO_URI = "mongodb+srv://srishtiMis:srishtiatnsut@cluster0.rxik0m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)
db = client["sports_proctor"]
scores_collection = db["scores"]

# --- Schema ---
class ScoreEntry(BaseModel):
    name: str
    sport: str
    reps: int
    score: int
    calories: float = 0.0

@app.post("/score")
async def save_score(data: ScoreEntry):
    if not data.name:
        raise HTTPException(status_code=400, detail="Name is required")
    
    new_record = {
        "name": data.name,
        "sport": data.sport,
        "reps": data.reps,
        "score": data.score,
        "calories": round(data.calories, 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    await scores_collection.insert_one(new_record)
    return {"message": "Cloud par score save ho gaya! ✅", "name": data.name}

@app.get("/leaderboard")
async def get_leaderboard():
    # Top scores fetch karega descending order mein
    cursor = scores_collection.find({}, {"_id": 0}).sort("score", -1).limit(10)
    return await cursor.to_list(length=10)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
