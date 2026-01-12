from datetime import date
from config import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    beds = db.relationship("GardenBed", back_populates="user", cascade="all, delete-orphan")
    plants = db.relationship("Plant", back_populates="user", cascade="all, delete-orphan")
    care_logs = db.relationship("CareLog", back_populates="user", cascade="all, delete-orphan")

    @property
    def password_hash(self):
        raise AttributeError("password_hash is write-only")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)


class GardenBed(db.Model):
    __tablename__ = "garden_beds"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="beds")
    plants = db.relationship("Plant", back_populates="bed", cascade="all, delete-orphan")


class Plant(db.Model):
    __tablename__ = "plants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    variety = db.Column(db.String)
    planted_date = db.Column(db.Date)
    notes = db.Column(db.String)

    bed_id = db.Column(db.Integer, db.ForeignKey("garden_beds.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    bed = db.relationship("GardenBed", back_populates="plants")
    user = db.relationship("User", back_populates="plants")
    care_logs = db.relationship("CareLog", back_populates="plant", cascade="all, delete-orphan")


class CareLog(db.Model):
    __tablename__ = "care_logs"

    id = db.Column(db.Integer, primary_key=True)
    care_type = db.Column(db.String, nullable=False)  # water / fertilize / prune
    date = db.Column(db.Date, nullable=False, default=date.today)
    notes = db.Column(db.String)

    plant_id = db.Column(db.Integer, db.ForeignKey("plants.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    plant = db.relationship("Plant", back_populates="care_logs")
    user = db.relationship("User", back_populates="care_logs")
