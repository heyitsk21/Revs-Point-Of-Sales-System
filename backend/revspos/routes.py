from flask import request, Flask
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, URL
import os

api = Api(version="1.0", title="RevsPos API")

test_model = api.model('SignUpModel', {"field": fields.String(required=True, min_length=1, max_length=64)})

@api.route('/api/test')
class Test(Resource):
    #api for testing
    @api.expect(test_model, validate=True)
    def post(self):
        req = request.get_json()
        return {"Field":"processed" + req.get("field")}, 200

# @api.route('/api/Connection')
# class Connection():

# @api.route('/api/Database')
# class Database(Resource):
    
    #opening a Flask constructor thingie
    #app = Flask(__name__)

    #Configuring that Flask instance for the database we want to connect to
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + username + ':' + password + '@host/' + database_name

    #db = SQLAlchemy(app)



    #class Database():
    #    con = ConnectToDatabase()

    #protected void finalize():
    #    CloseConnection()
    
    
    


    #opening a Flask constructor thingie
    # app = Flask(__name__)

    # #Configuring that Flask instance for the database we want to connect to
    # app.config['SQLALCHEMY_DATABASE_URI'] = ConnectToDatabase()

    # db = SQLAlchemy(app)
    


    # @app.route('/')
    # def index():
    #     return "Welcome to the RevsPOS API"



    # if __name__ == '__main__':
    #     with app.app_context():
    #         db.create_all() #creating all the tables
    #         app.run(debug=True) #i'm not exactly sure what this is doing tbh

