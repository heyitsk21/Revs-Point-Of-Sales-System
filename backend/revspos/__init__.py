# to run in backend dir $/flask --app revspos run 

from flask import Flask
from .api_master import api
from .employee_routes import init
from .manager_routes import init



def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='woah its a secret key') #TODO actually create a secret key 
  
    api.init_app(app)

    if test_config is None: 
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
    return app




