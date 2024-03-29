from flask import request, jsonify
from flask_restx import  Resource, fields
from sqlalchemy import text
# import os, decimal, datetime
from .api_master import api, db
print("got here")
menuGet_model = api.model('GetMenuModel', {"menugroup": fields.Integer(required=True)}) #String:     , min_length=1, max_length=64

placeOrder_model = api.model('PlaceOrderModel',{'menuitems': fields.List(fields.Integer),
                                                'customername':fields.String(required=True),
                                                'employeeid':fields.Integer(required=True)})
# def alchemyencoder(obj):
#     """JSON encoder function for SQLAlchemy special classes."""
#     if isinstance(obj, datetime.date):
#         return obj.isoformat()
#     elif isinstance(obj, decimal.Decimal):
#         return float(obj)

@api.route('/api/employee/getmenuitems')
class GetMenuItems(Resource):
    @api.expect(menuGet_model, validate=True)
    def post(self):
        menugroup = request.get_json().get("menugroup")
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from menuitems"))
            menuitemlist = []
            for row in result:
                if(row.menuid > menugroup and row.menuid < menugroup + 100):
                    menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "price":row.price})
        return jsonify(menuitemlist)

@api.route('/api/employee/placeorder')
class PlaceOrder(Resource):
    @api.expect(placeOrder_model, validate=True)
    def post(self):
        name = request.get_json().get("customername")
        employeeid = request.get_json().get("employeeid")
        menuids = request.get_json().get("menuitems")

        menuItemsInString ='(' + ','.join(str(x) for x in menuids) + ')'
        totalprice = 0
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("SELECT SUM(Price) FROM MenuItems WHERE MenuID IN " + menuItemsInString + ";")) 
            for row in result:
                totalprice = row.sum
            result = conn.execution_options(stream_results=True).execute(text("SELECT Ingredients.IngredientID, Ingredients.MinAmount, Ingredients.Count, COUNT(menuitems.MenuID) AS SelectionCount FROM menuitems JOIN menuitemingredients ON menuitems.MenuID = menuitemingredients.MenuID JOIN Ingredients ON menuitemingredients.IngredientID = Ingredients.IngredientID WHERE menuitems.MenuID IN "+ menuItemsInString + " GROUP BY Ingredients.IngredientID, Ingredients.MinAmount"))
            upIng = ''
            logIng = ''
            logMessage = "Order placed by: " + str(employeeid)
            for row in result:
                if row.count - row.selectioncount < row.minamount:
                    return None
                upIng += "UPDATE Ingredients SET Count = Count - "+ str(row.selectioncount) + " WHERE IngredientID = " + str(row.ingredientid) + "; "
                logIng += "INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ("+ str(row.ingredientid)+", "+str(-row.selectioncount)+", '"+logMessage+"', NOW()); "
            conn.connection.cursor().execute(upIng)
            conn.connection.cursor().execute(logIng)
            conn.connection.cursor().execute("INSERT INTO Orders (CustomerName, TaxPrice, BasePrice, OrderDateTime, EmployeeID) VALUES ( '"+name+"', "+str(float(totalprice) * 0.0825)+", "+str(totalprice)+", NOW(), "+str(employeeid)+")")
            conn.connection.commit()
                


        print(totalprice)
        return None
    
def init():
    return 