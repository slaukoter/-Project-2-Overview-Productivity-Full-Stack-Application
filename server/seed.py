from datetime import date, timedelta
from config import create_app, db
from models import User, GardenBed, Plant, CareLog

app = create_app()

def run_seed():
    print("Seeding database...")
    print("DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])

    with app.app_context():
        # wipe in safe order
        CareLog.query.delete()
        Plant.query.delete()
        GardenBed.query.delete()
        User.query.delete()
        db.session.commit()

        u1 = User(username="steven")
        u1.password_hash = "password"
        db.session.add(u1)
        db.session.commit()

        bed = GardenBed(
            name="Backyard Raised Bed",
            location="Back fence",
            user_id=u1.id
        )
        db.session.add(bed)
        db.session.commit()

        tomato = Plant(
            name="Tomato",
            variety="Cherry",
            planted_date=date.today() - timedelta(days=14),
            notes="Needs staking soon",
            bed_id=bed.id,
            user_id=u1.id,
        )

        basil = Plant(
            name="Basil",
            variety="Genovese",
            planted_date=date.today() - timedelta(days=10),
            notes="Pinch flowers",
            bed_id=bed.id,
            user_id=u1.id,
        )

        db.session.add_all([tomato, basil])
        db.session.commit()

        logs = [
            CareLog(
                care_type="water",
                date=date.today() - timedelta(days=2),
                notes="Deep water",
                plant_id=tomato.id,
                user_id=u1.id,
            ),
            CareLog(
                care_type="fertilize",
                date=date.today() - timedelta(days=7),
                notes="Fish emulsion",
                plant_id=tomato.id,
                user_id=u1.id,
            ),
            CareLog(
                care_type="water",
                date=date.today() - timedelta(days=1),
                notes="Light water",
                plant_id=basil.id,
                user_id=u1.id,
            ),
        ]
        db.session.add_all(logs)
        db.session.commit()

        print("Seeded ✅")
        print("Beds:", GardenBed.query.count())
        print("Plants:", Plant.query.count())
        print("CareLogs:", CareLog.query.count())

if __name__ == "__main__":
    run_seed()
