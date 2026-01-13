from datetime import date
from flask import request

from config import create_app, db
from models import GardenBed, Plant

app = create_app()


def parse_date(value):
    if not value:
        return None
    try:
        return date.fromisoformat(value)  # expects "YYYY-MM-DD"
    except ValueError:
        return None


@app.get("/health")
def health():
    return {"status": "ok"}, 200


# --------------------
# BEDS
# --------------------
@app.get("/beds")
def get_beds():
    beds = GardenBed.query.all()
    return [b.to_dict(include_plants=True) for b in beds], 200


@app.post("/beds")
def create_bed():
    data = request.get_json() or {}

    name = data.get("name")
    if not name:
        return {"error": "name is required"}, 400

    bed = GardenBed(
        name=name,
        location=data.get("location"),
        user_id=1  # TEMP until auth
    )
    db.session.add(bed)
    db.session.commit()

    return bed.to_dict(include_plants=True), 201


@app.patch("/beds/<int:id>")
def update_bed(id):
    bed = GardenBed.query.get(id)
    if not bed:
        return {"error": "Bed not found"}, 404

    data = request.get_json() or {}

    if "name" in data and not data["name"]:
        return {"error": "name cannot be empty"}, 400

    bed.name = data.get("name", bed.name)
    bed.location = data.get("location", bed.location)

    db.session.commit()
    return bed.to_dict(include_plants=True), 200


@app.delete("/beds/<int:id>")
def delete_bed(id):
    bed = GardenBed.query.get(id)
    if not bed:
        return {"error": "Bed not found"}, 404

    db.session.delete(bed)
    db.session.commit()
    return {}, 204


# --------------------
# PLANTS
# --------------------
@app.post("/plants")
def create_plant():
    data = request.get_json() or {}

    name = data.get("name")
    bed_id = data.get("bed_id")

    if not name:
        return {"error": "name is required"}, 400
    if not bed_id:
        return {"error": "bed_id is required"}, 400

    bed = GardenBed.query.get(bed_id)
    if not bed:
        return {"error": "Bed not found"}, 404

    planted_date = parse_date(data.get("planted_date"))
    if data.get("planted_date") and not planted_date:
        return {"error": "planted_date must be YYYY-MM-DD"}, 400

    plant = Plant(
        name=name,
        variety=data.get("variety"),
        planted_date=planted_date,
        notes=data.get("notes"),
        bed_id=bed_id,
        user_id=1  # TEMP until auth
    )

    db.session.add(plant)
    db.session.commit()
    return plant.to_dict(), 201


@app.patch("/plants/<int:id>")
def update_plant(id):
    plant = Plant.query.get(id)
    if not plant:
        return {"error": "Plant not found"}, 404

    data = request.get_json() or {}

    if "name" in data and not data["name"]:
        return {"error": "name cannot be empty"}, 400

    if "planted_date" in data:
        new_date = parse_date(data.get("planted_date"))
        if data.get("planted_date") and not new_date:
            return {"error": "planted_date must be YYYY-MM-DD"}, 400
        plant.planted_date = new_date

    plant.name = data.get("name", plant.name)
    plant.variety = data.get("variety", plant.variety)
    plant.notes = data.get("notes", plant.notes)

    if "bed_id" in data:
        bed = GardenBed.query.get(data["bed_id"])
        if not bed:
            return {"error": "Bed not found"}, 404
        plant.bed_id = data["bed_id"]

    db.session.commit()
    return plant.to_dict(), 200


@app.delete("/plants/<int:id>")
def delete_plant(id):
    plant = Plant.query.get(id)
    if not plant:
        return {"error": "Plant not found"}, 404

    db.session.delete(plant)
    db.session.commit()
    return {}, 204


if __name__ == "__main__":
    app.run(port=5555, debug=True)
