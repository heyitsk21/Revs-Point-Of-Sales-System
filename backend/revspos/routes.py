from flask import request, Flask, jsonify
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
# import os, decimal, datetime
from .database import Database

api = Api(version="1.0", title="RevsPos API")

db = Database()

test_model = api.model('SignUpModel', {"field": fields.String(required=True, min_length=1, max_length=64)})

@api.route('/api/test')
class Test(Resource):
    #api for testing
    @api.expect(test_model, validate=True)
    def post(self):
        req = request.get_json()
        return {"Field":"processed" + req.get("field")}, 200


# def alchemyencoder(obj):
#     """JSON encoder function for SQLAlchemy special classes."""
#     if isinstance(obj, datetime.date):
#         return obj.isoformat()
#     elif isinstance(obj, decimal.Decimal):
#         return float(obj)

@api.route('/api/manager/getmenuitems')
class GetMenuItems(Resource):
    def get(self):
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from menuitems"))
            menuitemlist = []
            row_data = {}
            for row in result:
                menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "price":row.price})
        return jsonify(menuitemlist)