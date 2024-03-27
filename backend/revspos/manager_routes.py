from flask import request, jsonify
from flask_restx import  Resource, fields
from sqlalchemy import text
# import os, decimal, datetime
from .api_master import api, db

GenerateExcessReport_model = api.model('GenerateExcessReport',{"startdate": fields.DateTime(required=True)})


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
    






@api.route('/api/manager/reports/generateexcessreport')
class GenerateExcessReport(Resource):
    @api.expect(GenerateExcessReport_model, validate=True)
    def post(self): 
        startdate = request.get_json().get("startdate")
        startdate_str = text(startdate)
        excess_query = "SELECT DISTINCT mi.MenuID, mi.ItemName FROM ingredients i JOIN menuitemingredients mii ON i.ingredientid = mii.ingredientid JOIN menuitems mi ON mii.menuid = mi.menuid LEFT JOIN ( SELECT ingredientid, SUM(amountchanged) AS total_sold FROM InventoryLog WHERE amountchanged < 1 AND logdatetime BETWEEN CAST('{inputdate}' AS TIMESTAMP) AND NOW() GROUP BY ingredientid ) il ON i.ingredientid = il.ingredientid WHERE (il.total_sold IS NULL OR -1*il.total_sold < 0.1 * i.count);".format(inputdate = startdate_str)
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(excess_query))
            ingredientslist = []
            for row in result:
                ingredientslist.append({"menuid":row.menuid, "itemname":row.itemname})
        return jsonify(ingredientslist)

def init():
    return 