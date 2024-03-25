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

@api.route('/api/Database')
class Database(Resource):
    #opening a Flask constructor thingie
    #app = Flask(__name__)

    #Configuring that Flask instance for the database we want to connect to
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + username + ':' + password + '@host/' + database_name

    #db = SQLAlchemy(app)



    #class Database():
    #    con = ConnectToDatabase()

    #protected void finalize():
    #    CloseConnection()
    
    def ConnectToDatabase():
        database_user = ""
        database_password = ""
        try:
            with open('login.txt', 'r') as file:
                lines = file.readlines()
                database_user = lines[0].strip()
                database_password = lines[1].strip()
        except FileNotFoundError:
            print('login.txt file not found.')
            exit(1)

        database_name = 'csce315_902_01_db'
    
        url_object = URL.create(
            'postgresql',
            username = database_user,
            password = database_password,
            host = 'csce-315-db.engr.tamu.edu',
            database = database_name,
        )
        #database_url = f'postgresql://{database_user}:{database_password}@localhost/{database_name}'
        #engine = create_engine(database_url)

        #engine = create_engine(url_object)

        #return engine
        return url_object
    
    #opening a Flask constructor thingie
    app = Flask(__name__)

    #Configuring that Flask instance for the database we want to connect to
    app.config['SQLALCHEMY_DATABASE_URI'] = ConnectToDatabase()

    db = SQLAlchemy(app)
    
    @app.route('/')
    def index():
        return "Welcome to the RevsPOS API"

    if __name__ == '__main__':
        with app.app_context():
            db.create_all() #creating all the tables
            app.run(debug=True) #i'm not exactly sure what this is doing tbh

