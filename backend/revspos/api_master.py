"""
This module initializes the Flask-RESTx API and the database connection for the RevsPos backend.

It imports the `Api` class from `flask_restx` and the `Database` class from the `database` module.

The `api` object represents the RESTful API with a specific version and title, while the `db` object represents the database connection.

Both the API and database connection are essential components of the backend.

Attributes:
    api (Api): Represents the Flask-RESTx API with a specific version and title.
    db (Database): Represents the database connection for the backend.

Note:
    The `api` and `db` objects are essential for the functionality of the backend, and their initialization is crucial.

"""

from flask_restx import Api
from .database import Database

# Initialize the Flask-RESTx API with version and title
api = Api(version="1.0", title="RevsPos API")

# Initialize the database connection
db = Database()