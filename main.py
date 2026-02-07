from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Database (In-Memory List) ------------------
# Ab ye ek list hai jo saare users ka data save karegi
db_scores = []

# ------------------ Request Models ------------------

class ScoreEntry(BaseModel):
    name: str
    sport: str
    reps: int
    score: int
    calories: float = 0.0

# ------------------ Routes ------------------

@app.get("/")
def home():
    return {"status": "Sports Proctor Server Online 🚀", "total_records": len(db_scores)}

# ---------- Submit Score Based on Name & Sport ----------
@app.post("/score")
def save_score(data: ScoreEntry):
    if not data.name:
        raise HTTPException(status_code=400, detail="Name is required")
    
    # Naya record create ho raha hai
    new_record = {
        "name": data.name,
        "sport": data.sport,
        "reps": data.reps,
        "score": data.score,
        "calories": round(data.calories, 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    db_scores.append(new_record)
    print(f"🔥 New Record Added: {new_record}")
    
    return {"message": "Score saved successfully!", "entry": new_record}

# ---------- Get All Scores (Leaderboard) ----------
@app.get("/leaderboard")
def get_scores():
    # Score ke basis par sort karke top records dikhayega
    sorted_scores = sorted(db_scores, key=lambda x: x['score'], reverse=True)
    return sorted_scores

# ---------- Get Specific User History ----------
@app.get("/history/{name}")
def user_history(name: str):
    user_data = [s for s in db_scores if s['name'].lower() == name.lower()]
    return {"user": name, "history": user_data}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
