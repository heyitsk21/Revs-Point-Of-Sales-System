"""
This module provides functionality for managing the database connection using SQLAlchemy.

It imports the necessary modules from `flask_sqlalchemy` and `sqlalchemy`.

The `Database` class contains methods for getting the database URL and initializing the database engine.

Attributes:
    url (str): Represents the URL of the database.
    engine (Engine): Represents the SQLAlchemy engine for the database connection.

Methods:
    GetDatabaseURL: Retrieves the database URL from a configuration file.
    __init__: Initializes the database URL and engine using SQLAlchemy.

"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, URL, text

class Database():
    url = None
    engine = None 

    def GetDatabaseURL(self):
        """
        Retrieves the database URL from a configuration file.
        
        Reads the database credentials from a file named 'login.txt' and constructs the database URL.
        
        Returns:
            str: The database URL constructed from the credentials.
        """
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
        """
        Initializes the database URL and engine using SQLAlchemy.

        Calls the GetDatabaseURL method to retrieve the database URL and creates an engine using SQLAlchemy.
        """
        self.url = self.GetDatabaseURL()
        self.engine = create_engine(self.url)
