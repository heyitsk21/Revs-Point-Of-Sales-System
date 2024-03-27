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
    
@api.route('/api/manager/getingredients')
class GetIngredients(Resource):
    def get(self):
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from ingredients"))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount})
        return jsonify(menuitemlist)
    
@api.route('/api/manager/getorderhistory')
class GetOrderHistory(Resource):
    def get(self):
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from orders LIMIT 100"))
            orderlist = []
            for row in result:
                orderlist.append({"orderid":row.orderid, "customername":row.customername, "taxprice":row.taxprice,"baseprice":row.baseprice,"orderdatetime":row.orderdatetime,"employeeid":row.employeeid})
        return jsonify(orderlist)
    
        
def init():
    return 