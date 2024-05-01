# to run in backend dir $/flask --app revspos run 

"""
This module initializes the Flask application for the RevsPOS backend.

To run the application, use the following command:
    $ flask --app revspos run

The application includes routes for both employees and managers, as well as an API master.
"""

from flask import Flask
from .api_master import api
from .employee_routes import init
from .manager_routes import init
from flask_cors import CORS

def create_app(test_config=None):
    """
    Create and configure the Flask application.

    Parameters:
        test_config (dict, optional): Configuration settings for testing. Defaults to None.

    Returns:
        Flask: The configured Flask application instance.
    """
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='woah its a secret key') #TODO actually create a secret key 
  
    cors = CORS()
    api.init_app(app)
    print(cors)
    cors.init_app(app)
    if test_config is None: 
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
    return app