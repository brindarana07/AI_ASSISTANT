from flask import Flask
from flask_cors import CORS

from config import Config
from database import init_db
from feedback import feedback_bp
from routes import api_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/*": {"origins": "*"}})
    init_db()
    app.register_blueprint(api_bp)
    app.register_blueprint(feedback_bp)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)
