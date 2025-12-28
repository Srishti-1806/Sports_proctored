from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient, errors
import uvicorn

# ------------------ MongoDB Setup ------------------
MONGO_URI = "mongodb+srv://43srishtimishra_db_user:0618%40SRI@cluster0.v3zv4v0.mongodb.net/"
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client["sports_proctor"]
    scores_collection = db["scores"]
    client.server_info()  # Trigger connection exception if fails
    print("✅ Connected to MongoDB")
except errors.ServerSelectionTimeoutError as e:
    print("❌ Could not connect to MongoDB:", e)
    exit(1)

# ------------------ FastAPI Setup ------------------
app = FastAPI(title="Sports Proctor API")

# Allow all origins for testing purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Request Model ------------------
class ScoreRequest(BaseModel):
    name: str
    score: float

# ------------------ Routes ------------------
@app.get("/")
def home():
    return {"status": "server online", "api": "sports_proctor"}

@app.post("/score")
def score(data: ScoreRequest):
    try:
        entry = {"name": data.name, "score": data.score}
        scores_collection.insert_one(entry)
        return {"message": "Score saved!", "data": entry}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save score: {e}")

@app.get("/leaderboard")
def leaderboard(limit: int = 20):
    try:
        top_scores = list(
            scores_collection.find({}, {"_id": 0})
            .sort("score", -1)
            .limit(limit)
        )
        return {"leaderboard": top_scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {e}")

@app.get("/users/{name}")
def get_user_scores(name: str):
    try:
        records = list(
            scores_collection.find({"name": name}, {"_id": 0})
            .sort("score", -1)
        )
        return {"name": name, "scores": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user scores: {e}")

# ------------------ Entry Point ------------------
if __name__ == "__main__":
    print("🚀 Server running at http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
