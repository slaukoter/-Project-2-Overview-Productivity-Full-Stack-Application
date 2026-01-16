import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False


    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "sqlite:///gardenbuddy.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    from models import User, GardenBed, Plant, CareLog

    return app

