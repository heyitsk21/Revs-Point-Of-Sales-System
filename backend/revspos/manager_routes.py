from flask import request, jsonify
from flask_restx import  Resource, fields
from sqlalchemy import text
# import os, decimal, datetime
from .api_master import api, db



@api.route('/api/manager/getmenuitems')
class GetMenuItems(Resource):
    def get(self):
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from menuitems"))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "price":row.price})
        return jsonify(menuitemlist)