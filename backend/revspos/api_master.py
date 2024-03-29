from flask_restx import Api
from .database import Database

#this is needed trust

api = Api(version="1.0", title="RevsPos API")
db = Database()

