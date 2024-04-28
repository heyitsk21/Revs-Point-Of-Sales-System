from flask import request, jsonify
from flask_restx import  Resource, fields
from sqlalchemy import text
# import os, decimal, datetime
from .api_master import api, db
print("got here")
menuGet_model = api.model('GetMenuModel', {"menugroup": fields.Integer(required=True)}) #String:     , min_length=1, max_length=64
customization_model = api.model('CustomizationModel', {'menuid': fields.Integer(required=True), 'customizationids': fields.List(fields.Integer)})
placeOrder_model = api.model('PlaceOrderModel',{'menuitems': fields.List(fields.Nested(customization_model)),
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
                    menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "price":row.price, "picturepath":row.picturepath})
        return jsonify(menuitemlist)

@api.route('/api/employee/placeorder')
class PlaceOrder(Resource):
    @api.expect(placeOrder_model, validate=True)
    def post(self):
        name = request.get_json().get("customername")
        employeeid = request.get_json().get("employeeid")
        menuitems = request.get_json().get("menuitems", [])
        # print('name: '+str(name))
        # print('empl id: '+str(employeeid))
        # print('menuitems: '+str(menuitems))
        
        allmenuids = '('
        allcustomizationids = {}
        allmenuidcustomizations = {}
        for item in menuitems:
            menuid = item.get("menuid")
            allmenuids += str(menuid) + ','
            currcust_list = item.get("customizationids", [])

            allmenuidcustomizations[menuid] = currcust_list
            
            for cust in currcust_list:
                if not (cust in allcustomizationids):
                    allcustomizationids[cust] = 1
                else:
                    allcustomizationids[cust] += 1
        
        # for thing in allcustomizationids:
        #     print('allcust: '+str(thing) + '::'+str(allcustomizationids[thing]))
        allmenuids = allmenuids[:-1]
        allmenuids += ')'
        # print(str(allmenuids))
        totalprice = 0
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("SELECT SUM(Price) FROM MenuItems WHERE MenuID IN " + allmenuids + ";")) 
            for row in result:
                totalprice = row.sum
            result = conn.execution_options(stream_results=True).execute(text("SELECT Ingredients.IngredientID, Ingredients.MinAmount, Ingredients.Count, COUNT(menuitems.MenuID) AS SelectionCount FROM menuitems JOIN menuitemingredients ON menuitems.MenuID = menuitemingredients.MenuID JOIN Ingredients ON menuitemingredients.IngredientID = Ingredients.IngredientID WHERE menuitems.MenuID IN " + allmenuids + " GROUP BY Ingredients.IngredientID, Ingredients.MinAmount; "))
            upIng = ''
            logIng = ''
            logMessage = "Order placed by: " + str(employeeid)
            for row in result:
                if row.count - row.selectioncount < row.minamount:
                    print("returned because ingredient counts less ")
                    return None
                upIng += "UPDATE Ingredients SET Count = Count - "+ str(row.selectioncount) + " WHERE IngredientID = " + str(row.ingredientid) + "; "
                logIng += "INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ("+ str(row.ingredientid)+", "+str(-row.selectioncount)+", '"+logMessage+"', NOW()); "
            
            result_cust = conn.execution_options(stream_results=True).execute(text("SELECT Ingredients.IngredientID, Ingredients.MinAmount, Ingredients.Count, COUNT(menuitems.MenuID) AS SelectionCount FROM menuitems JOIN menuitemcustomizations ON menuitems.MenuID = menuitemcustomizations.MenuID JOIN Ingredients ON menuitemcustomizations.CustomizationID = Ingredients.IngredientID WHERE menuitems.MenuID IN " + allmenuids + " GROUP BY Ingredients.IngredientID, Ingredients.MinAmount"))
            for row in result_cust:
                if row.count - row.selectioncount < row.minamount:
                    print("customizations do not have enough inventory to be processed")
                    return None
                if row.ingredientid in allcustomizationids:
                    upIng += "UPDATE Ingredients SET Count = Count - "+ str(allcustomizationids[row.ingredientid]) + " WHERE IngredientID = " + str(row.ingredientid) + "; "
                    logIng += "INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ("+ str(row.ingredientid)+", "+str(-allcustomizationids[row.ingredientid])+", '"+logMessage+"', NOW()); "
            
            conn.connection.cursor().execute(upIng)
            conn.connection.cursor().execute(logIng)
            conn.connection.commit()
            conn.connection.cursor().execute("INSERT INTO Orders (CustomerName, TaxPrice, BasePrice, OrderDateTime, EmployeeID, OrderStat) VALUES ( '"+name+"', "+str(float(totalprice) * 0.0825)+", "+str(totalprice)+", NOW(), "+str(employeeid)+", 'inprogress') RETURNING orderid")
            conn.connection.commit()
            result = conn.execution_options(stream_results=True).execute(text(f"SELECT ORDERID FROM ORDERS WHERE CUSTOMERNAME = '{name}' ORDER BY ORDERDATETIME DESC LIMIT 1;"))
            
            for row in result:
                getOrderID = row.orderid

            print(str(getOrderID))
            #TODO add to menu items order junction table
            for item in allmenuidcustomizations:
                conn.connection.cursor().execute("INSERT INTO ordermenuitems (OrderID,MenuID) VALUES ("+str(getOrderID)+","+str(item)+") RETURNING joinid")

                result =conn.execution_options(stream_results=True).execute(text(f"SELECT JOINID FROM ORDERMENUITEMS ORDER BY JOINID DESC LIMIT 1;"))
                for row in result:
                    getJoinID = row.joinid
                print(str(getJoinID))
                conn.connection.cursor().execute("UPDATE ordermenuitems SET customizationid = "+str(getJoinID)+" where joinid = "+str(getJoinID))
                if len(allmenuidcustomizations[item]) > 0:
                    for cust in allmenuidcustomizations[item]:
                        conn.connection.cursor().execute("INSERT INTO CustomizationOrderMenu (customizationordermenuid,ingredientid) VALUES ("+str(getJoinID)+","+str(cust)+")")
            conn.connection.commit()
        # print(totalprice)
        return None
    
def init():
    return 