from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Request Model ------------------
class ScoreRequest(BaseModel):
    name: str
    score: int  # Sirf name aur score jayega

# ------------------ Routes ------------------
@app.get("/")
def home():
    return {"status": "server online"}

@app.post("/score")
def score(data: ScoreRequest):
    try:
        # Yahan hum sirf print kar rahe hain ki data mil gaya
        print(f"✅ Data Received: Name={data.name}, Score={data.score}")
        
        # Ye JSON wapas client (PyQt6) ko jayega
        return {
            "message": "Score received successfully!",
            "name": data.name,
            "score": data.score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
