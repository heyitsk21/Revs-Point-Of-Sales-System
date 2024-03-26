from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, URL, text

class Database():
    url = None
    engine = None 

    def GetDatabaseURL(self):
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
        return url_object

    def __init__(self):
        self.url = self.GetDatabaseURL()
        self.engine = create_engine(self.url)
