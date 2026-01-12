from config import create_app, db
from models import User, GardenBed, Plant, CareLog

app = create_app()

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(port=5555, debug=True)
