# to run in backend dir $/flask --app revspos run 


from flask import Flask, jsonify
from .routes import api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, URL, text

def GetDatabaseURL():
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

    # @api.expect(test_model, validate=True)
    # def post(self):
    #     req = request.get_json()
    #     return {"Field":"processed" + req.get("field")}, 200

    #return engine
    return url_object


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='woah its a secret key') #TODO actually create a secret key 
    api.init_app(app)

    if test_config is None: 
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    url = GetDatabaseURL()

    engine = create_engine(url)
    
    #do sm sql here
    with engine.connect() as conn:
        result = conn.execution_options(stream_results=True).execute(text("select * from menuitems"))
        # with conn.begin():
        menuitemlist = {} 
        for row in result:
            menuitemlist[row.menuid] = row.itemname #f"menuid: {row.menuid} - itemname: {row.itemname}"


    @app.route('/getmenuitems')
    def getmenuitems():
        #return 'Hello, World!' #return whatever here
        return jsonify(menuitemlist), 200

    return app


