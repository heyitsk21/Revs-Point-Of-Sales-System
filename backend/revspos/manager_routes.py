from flask import request, jsonify
from flask_restx import  Resource, fields
from sqlalchemy import text
# import os, decimal, datetime
from .api_master import api, db

AddIngredient_model = api.model('AddIngredient', {"ingredientid":fields.Integer(required=True), "ingredientname":fields.String(min_length=3,max_length=30,required=True), "count":fields.Integer(required=True), "ppu":fields.Float(required=True), "minamount":fields.Integer(required=True)})
UpdateIngredient_model = api.model('AddIngredient', {"ingredientid":fields.Integer(required=True), "ingredientname":fields.String(min_length=3,max_length=30), "count":fields.Integer, "ppu":fields.Float, "minamount":fields.Integer})

GetIngredientsFromMenuItem_model = api.model('GetIngredientsFromMenuItem', {"menuitemid":fields.Integer(required=True)})
AddIngredientToMenuItem_model = api.model('AddIngredientToMenuItem', {"menuitemid":fields.Integer(required=True), "ingredientid":fields.Integer(required=True)})
DeleteIngredientFromMenuItem_model = api.model('DeleteIngredientFromMenuItem', {"menuitemid":fields.Integer(required=True), "ingredientid":fields.Integer(required=True)})

# GetOrder_model = api.model('GetOrder', {"orderid":fields.Integer, "numberOfOutputs":fields.Integer})
UpdateOrder_model = api.model('UpdateOrder', {"orderid":fields.Integer(required=True), "customername":fields.String(min_length=3, max_length=25), "baseprice":fields.Float, "employeeid":fields.Integer})
DeleteOrder_model = api.model('DeleteOrder', {"orderid":fields.Integer(required=True)})

GenerateExcessReport_model = api.model('GenerateExcessReport',{"startdate": fields.Date(required=True)})
GenerateProductUsage_model = api.model('GenerateProductUsage',{"startdate": fields.Date(required=True), "enddate": fields.Date(required=True)})
GenerateSalesReport_model = api.model('GenerateSalesReport',{"startdate": fields.Date(required=True), "enddate": fields.Date(required=True)})
GenerateOrderTrend_model = api.model('GenerateOrderTrend',{"startdate": fields.Date(required=True), "enddate": fields.Date(required=True)})

@api.route('/api/manager/getmenuitems')
class GetMenuItems(Resource):
    def post(self):
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from menuitems"))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "price":row.price})
        return jsonify(menuitemlist)
    
@api.route('/api/manager/ingredients')
class Ingredients(Resource):
    def get(self): #GetIngredients
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from ingredients"))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount})
        return jsonify(menuitemlist)
    
    @api.expect(AddIngredient_model, validate=True)
    def post(self): #AddIngredient
        data = request.get_json()
        ingredientid = data.get("ingredientid")
        ingredientname = data.get("ingredientname")
        count = data.get("count")
        ppu = data.get("ppu")
        minamount = data.get("minamount")
        
        if (ingredientid == 0 or ingredientname == "string" or count == 0 or ppu == 0 or minamount == 0):
            return jsonify({"message":"failed to insert ingredient. Missing fields. All fields are required."})
        
        insert_query = text("INSERT INTO Ingredients (IngredientID, Ingredientname, Count, PPU, minamount) VALUES ({inputingredientid}, '{inputingredientname}', {inputcount}, {inputppu}, {inputminamount})".format(inputingredientid=ingredientid,inputingredientname=ingredientname,inputcount=count,inputppu=ppu, inputminamount=minamount))
        with db.engine.connect() as conn:
            result = conn.execute(insert_query)
            conn.commit()
        return jsonify({"message":"Sucessfully inserted the ingredient with ingredientid = {inputingredientid} and ingredientname = {inputingredientname}".format(inputingredientid=ingredientid,inputingredientname=ingredientname)})

    @api.expect(UpdateIngredient_model, validate=True)
    def put(self): #UpdateIngredient
        data = request.get_json()
        ingredientid = data.get("ingredientid")
        newname = data.get("newName")
        newcount = data.get("newCount")
        newppu = data.get("newPPU")
        newminamount = data.get("newMinAmount")
        
        if (ingredientid == 0):
            return jsonify({"message": "No orderid entered. No query executed."})
        elif (newname == "string" and newcount == 0 and newppu == 0 and newminamount == 0):
            return jsonify({"message": "No inputs entered. No query executed."})

        update_query = "UPDATE ingredients SET "
        if (newname != "string"):
            update_query += "ingredientname = {inputnewname},".format(inputnewname=newname)
        if (newcount > 0):
            update_query += "count = {inputnewcount},".format(inputnewcount=newcount)
        if (newppu > 0):
            update_query += "ppu = {inputnewppu},".format(inputnewppu=newppu)
        if (newminamount > 0):
            update_query += "minamount = {inputnewminamount},".format(inputnewminamount=newminamount)
        
        update_query = update_query[:-1]
        update_query += " WHERE IngredientID = {inputingredientid}}".format(inputingredientid=ingredientid)
        
        with db.engine.connect() as conn:
            conn.execute(update_query)
            conn.commit()
        
        return jsonify({"message": "successful update of ingredient with ingredientid = {inputingredientid}".format(inputingredientid=ingredientid)})
    


@api.route('/api/manager/menuitemingredients')
class MenuItemIngredients(Resource):
    @api.expect(GetIngredientsFromMenuItem_model, validate=True)
    def get(self): #GetIngredientFromMenuItem
        with db.engine.connect() as conn:
            menuitemid = request.get_json().get("menuitemid") #TODO: PARAMETERIZE??? What integers are valid?
            result = conn.execution_options(stream_results=True).execute(text("select * from menuitemingredients where menuid = {inputmenuitemid}".format(inputmenuitemid = menuitemid)))
            menuitemingredientslist = []
            for row in result:
                menuitemingredientslist.append({"menuid":row.menuid, "ingredientid":row.ingredientid})
        return jsonify(menuitemingredientslist)
    
    @api.expect(AddIngredientToMenuItem_model, validate=True)
    def post(self): #AddIngredientToMenuItem
        menuitemid = request.get_json().get("menuitemid") #TODO: PARAMETERIZE??? What integers are valid?
        ingredientid = request.get_json().get("ingredientid") #TODO: PARAMETERIZE??? What integers are valid?

        add_ingredient_query = "INSERT INTO menuitemIngredients (MenuID, IngredientID) values ({inputmenuitemid},{inputingredientid})".format(inputmenuitemid = menuitemid, inputingredientid = ingredientid)
                   
        with db.engine.connect() as conn:
            result = conn.execute(text(add_ingredient_query)) #execution_options(stream_results=True).
            conn.commit()

            select_add_ingredient_query = "SELECT * FROM menuitemingredients WHERE menuid = {inputmenuitemid}".format(inputmenuitemid = menuitemid)
            resultselect = conn.execution_options(stream_results=True).execute(text(select_add_ingredient_query))
            menuitemingredientslist = []
            for row in resultselect:
                menuitemingredientslist.append({"menuid":row.menuid,"ingredientid":row.ingredientid})
        return jsonify(menuitemingredientslist)
    
    @api.expect(DeleteIngredientFromMenuItem_model, validate=True)
    def delete(self): #DeleteIngredientFromMenuItem
        menuitemid = request.get_json().get("menuitemid") #TODO: PARAMETERIZE??? What integers are valid?
        ingredientid = request.get_json().get("ingredientid") #TODO: PARAMETERIZE??? What integers are valid?

        delete_ingredient_query = "DELETE FROM menuitemIngredients WHERE MenuID={inputmenuitemid} AND ingredientID={inputingredientid}".format(inputmenuitemid = menuitemid, inputingredientid = ingredientid)

        with db.engine.connect() as conn:
            conn.connection.cursor().execute(text(delete_ingredient_query))

            # select menuid, count(menuid) as entries from menuitemingredients where menuid=201 group by menuid; <-- "entries" is the number of ingredients a menu item has



            # select_delete_ingredient_query = "SELECT * FROM menuitemingredients WHERE menuid = {inputmenuitemid}".format(inputmenuitemid = menuitemid)
            # resultselect = conn.execution_options(stream_results=True).execute(text(select_delete_ingredient_query))
            # menuitemingredientslist = []
            # for row in resultselect:
            #     menuitemingredientslist.append({"menuid":row.menuid,"ingredientid":row.ingredientid})
        

        
            # conn.connection.cursor().execute(select_delete_ingredient_query)
            # myCursorResult = conn.connection.cursor().fetchall()
            # num_ingredients = len(myCursorResult)
            conn.commit()

            # select menuid, count(menuid) as entries from menuitemingredients where menuid=201 group by menuid; <-- "entries" should be 1 less than before


            # if (len(menuitemingredientslist) != 1):
            #     menuitemingredientslist.append({"status":"failed to delete ingredient from menu item with menuid = {inputmenuitemid}".format(inputmenuitemid = menuitemid)})
            # else:
            #     menuitemingredientslist.append({"status":"successfully deleted ingredient from menu item with menuid = {inputmenuitemid}".format(inputmenuitemid = menuitemid)})

        # return jsonify(menuitemingredientslist)
            return jsonify({"message":"successfully deleted order with menuid = {inputmenuitemid} and ingredient = {inputingredientid}".format(inputmenuitemid = menuitemid, inputingredientid = ingredientid)})

@api.route('/api/manager/orderhistory')
class OrderHistory(Resource):
    # @api.expect(GetOrder_model, validate=True)
    def get(self): #GetOrderHistory
        with db.engine.connect() as conn:
            # orderid = request.get_json().get("orderid")
            # numberOfOutputs = request.get_json().get("numberOfOutputs")
            # if (numberOfOutputs == 0):
            limit_query = "LIMIT 100"
            # elif (orderid != 0):
            #     limit_query = "WHERE orderid = {inputorderid}".format(inputorderid=orderid)
            # else:
            #     jsonify({"message":"failed to get order(s)"})
            get_order_query = "SELECT * FROM orders {inputquery}".format(inputquery=limit_query)
            result = conn.execution_options(stream_results=True).execute(text(get_order_query))
            orderlist = []
            for row in result:
                orderlist.append({"orderid":row.orderid, "customername":row.customername, "taxprice":row.taxprice,"baseprice":row.baseprice,"orderdatetime":row.orderdatetime,"employeeid":row.employeeid})
        return jsonify(orderlist)
    
    @api.expect(UpdateOrder_model, validate=True)
    def post(self): #UpdateOrder
        orderid = request.get_json().get("orderid") #TODO: PARAMETERIZE??? What integers are valid?
        customername = request.get_json().get("customername") #TODO: PARAMETERIZE??? NEED TO MAKE SURE THIS ISN'T VULNERABLE TO SQL INJECTION!
        baseprice = request.get_json().get("baseprice") #TODO: PARAMETERIZE??? What floats are valid?
        employeeid = request.get_json().get("employeeid") #TODO: PARAMETERIZE??? What ints are valid?

        if (orderid == 0):
            return jsonify({"message": "No orderid entered. No query executed."})
        elif (customername == "string" and baseprice == 0 and employeeid == 0): 
            return jsonify({"message": "No inputs entered. No query executed."})
        
        update_order_query = "UPDATE orders SET "
        if (customername != "string"):
            update_order_query += "CustomerName = '{inputcustomername}',".format(inputcustomername=customername)
        if (baseprice > 0):
            taxprice = baseprice*0.0825
            update_order_query += "baseprice = {inputbaseprice}, taxprice = {inputtaxprice},".format(inputbaseprice=baseprice, inputtaxprice=taxprice)
        if (employeeid > 0):
            update_order_query += "employeeID = {inputemployeeid},".format(inputemployeeid=employeeid)
        
        update_order_query = update_order_query[:-1]
        update_order_query += " WHERE orderid = {inputorderid}".format(inputorderid=orderid)

        with db.engine.connect() as conn:
            result = conn.execute(text(update_order_query)) #execution_options(stream_results=True).
            conn.commit()

            # select_updated_order_query = "SELECT * FROM orders WHERE orderid = {inputorderid}".format(inputorderid = orderid)
            # resultselect = conn.execution_options(stream_results=True).execute(text(select_updated_order_query))
            # orderlist = []
            # for row in resultselect:
            #     orderlist.append({"orderid":row.orderid,"customername":row.customername, "taxprice":row.taxprice, "baseprice":row.baseprice, "orderdatetime":row.orderdatetime, "employeeid":row.employeeid})
        return jsonify({"message": "Order Update Successful."})
    
    @api.expect(DeleteOrder_model, validate=True)
    def delete(self): #DeleteOrder TODO: NOT WORKING RIGHT
        orderid = request.get_json().get("orderid") #TODO: PARAMETERIZE??? What integers are valid?
        if (orderid >= 0):
            delete_order_query = "DELETE FROM Orders WHERE orderid = {inputorderid}".format(inputorderid = orderid)
        else: 
            #TODO: check for other ways to get failure
            return jsonify({"message":"failed to deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})
        with db.engine.connect() as conn:
            # select_delete_order_query = "SELECT * FROM orders WHERE orderid = {inputorderid}".format(inputorderid = orderid)
            
            # resultselect = conn.execution_options(stream_results=True).execute(text(select_delete_order_query))

            # orderlist = []
            # for row in resultselect:
            #     orderlist.append({"orderid":row.orderid,"customername":row.customername, "taxprice":row.taxprice, "baseprice":row.baseprice, "orderdatetime":row.orderdatetime, "employeeid":row.employeeid})
            
            result_cursor = conn.connection.cursor().execute(delete_order_query)
        
            conn.commit()

            # if (len(orderlist) != 1): #this is only making sure 1 deletion occurred. it doesn't verify anything else.
            #     orderlist.append({"status":"failed to delete order with orderid = {inputorderid}".format(inputorderid = orderid)})
            # else:
            #     orderlist.append({"status":"successfully deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})
            try:
                if (result_cursor is None):
                    return jsonify({"message":"successfully deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})
            except:
                return jsonify({"message":"failed to deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})



'''Manager Reports'''
@api.route('/api/manager/reports/generateproductusage')
class GenerateProductUsage(Resource):
    @api.expect(GenerateProductUsage_model, validate=True)
    def post(self): 
        startdate = request.get_json().get("startdate") #TODO: PARAMETERIZE???
        startdate_str = text(startdate)
        enddate = request.get_json().get("enddate") #TODO: PARAMETERIZE???
        enddate_str = text(enddate)
        prod_usage_query = "SELECT IL.IngredientID, I.IngredientName, SUM(IL.AmountChanged) AS TotalAmountChanged FROM InventoryLog IL JOIN Ingredients I ON IL.IngredientID = I.IngredientID WHERE IL.AmountChanged < 0 AND DATE(IL.LogDateTime) BETWEEN CAST('{inputstart}' AS DATE) AND CAST('{inputend}' AS DATE) GROUP BY IL.IngredientID, I.IngredientName".format(inputstart = startdate_str, inputend = enddate_str)
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(prod_usage_query))
            ingredientslist = []
            for row in result:
                ingredientslist.append({"ingredientid":row.ingredientid,"ingredientname":row.ingredientname, "totalamountchanged":row.totalamountchanged})
                #TODO: front end report will only need to show Ingredient Name and Total Amount Changed!
        return jsonify(ingredientslist)
    
@api.route('/api/manager/reports/generatesalesreport')
class GenerateSalesReport(Resource):
    @api.expect(GenerateSalesReport_model, validate=True)
    def post(self): 
        startdate = request.get_json().get("startdate") #TODO: PARAMETERIZE???
        startdate_str = text(startdate)
        enddate = request.get_json().get("enddate") #TODO: PARAMETERIZE???
        enddate_str = text(enddate)
        sales_query = "SELECT menuitems.MenuID, menuitems.ItemName, SUM(menuitems.Price) AS TotalSales, COUNT(*) AS OrderCount FROM orders JOIN ordermenuitems ON orders.OrderID = ordermenuitems.OrderID JOIN menuitems ON ordermenuitems.MenuID = menuitems.MenuID WHERE orders.OrderDateTime BETWEEN TO_TIMESTAMP('{inputstart}', 'YYYY-MM-DD') AND TO_TIMESTAMP('{inputend}', 'YYYY-MM-DD') GROUP BY menuitems.MenuID, menuitems.ItemName ORDER BY TotalSales DESC".format(inputstart = startdate_str, inputend = enddate_str)
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(sales_query))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "totalsales":row.totalsales, "ordercount":row.ordercount})
        return jsonify(menuitemlist)

@api.route('/api/manager/reports/generateexcessreport')
class GenerateExcessReport(Resource):
    @api.expect(GenerateExcessReport_model, validate=True)
    def post(self): 
        startdate = request.get_json().get("startdate") #TODO: PARAMETERIZE???
        startdate_str = text(startdate)
        excess_query = "SELECT DISTINCT mi.MenuID, mi.ItemName FROM ingredients i JOIN menuitemingredients mii ON i.ingredientid = mii.ingredientid JOIN menuitems mi ON mii.menuid = mi.menuid LEFT JOIN ( SELECT ingredientid, SUM(amountchanged) AS total_sold FROM InventoryLog WHERE amountchanged < 1 AND logdatetime BETWEEN CAST('{inputdate}' AS TIMESTAMP) AND NOW() GROUP BY ingredientid ) il ON i.ingredientid = il.ingredientid WHERE (il.total_sold IS NULL OR -1*il.total_sold < 0.1 * i.count)".format(inputdate = startdate_str)
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(excess_query))
            ingredientslist = []
            for row in result:
                ingredientslist.append({"menuid":row.menuid, "itemname":row.itemname})
        return jsonify(ingredientslist)

@api.route('/api/manager/reports/generaterestockreport')
class GenerateRestockReport(Resource):
    def get(self): 
        restock_query = "SELECT * FROM ingredients WHERE count < minamount"
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(restock_query))
            ingredientlist = []
            for row in result:
                ingredientlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu, "count":row.count, "minamount":row.minamount})
                # TODO: front end will only need to show ingredientname, count as Current Amount, and minamount as Minimum Amount!
        return jsonify(ingredientlist)

@api.route('/api/manager/reports/generateordertrend')
class GenerateOrderTrend(Resource):
    @api.expect(GenerateOrderTrend_model, validate=True)
    def post(self): 
        startdate = request.get_json().get("startdate") #TODO: PARAMETERIZE???
        startdate_str = text(startdate)
        enddate = request.get_json().get("enddate") #TODO: PARAMETERIZE???
        enddate_str = text(enddate)
        order_trend_query = "SELECT DISTINCT MID1, MID2, Count (*) AS count FROM (SELECT n1.itemname AS MID1, n2.itemname AS MID2, t1.OrderID FROM OrderMenuItems t1 JOIN OrderMenuItems t2 ON t1.OrderID = t2.OrderID AND t1.menuID <  t2.MenuID JOIN Orders ON Orders.OrderID = t1.OrderID Join MenuItems n1 ON t1.MenuID = n1.MenuID JOIN MenuItems n2 on n2.MenuID = t2.MenuID WHERE Orders.OrderDateTime BETWEEN CAST('{inputstart}' AS DATE) AND CAST('{inputend}' AS DATE)) AS doubleJoin  GROUP BY MID1, MID2 ORDER BY count DESC LIMIT 10".format(inputstart = startdate_str, inputend = enddate_str)
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(order_trend_query))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"menuid1":row.mid1, "menuid2":row.mid2, "count":row.count})
        return jsonify(menuitemlist)
    



'''@api.route('/api/manager/createingredient')
class CreateIngredient(Resource):

@api.route('/api/manager/editingredient/<int:ingredient_id>')
class EditIngredient(Resource):
'''    

@api.route('/api/manager/deleteingredient/<int:ingredient_id>/<int:ingredient_count>')
class DeleteIngredient(Resource):
    def delete(self, ingredient_id, ingredient_count):
        delete_from_join_cmd = text("DELETE FROM MenuItemIngredients WHERE IngredientID = :ingredient_id")
        with db.engine.connect() as conn:
            conn.execute(delete_from_join_cmd, ingredient_id=ingredient_id)

        delete_ingredient_cmd = text("DELETE FROM Ingredients WHERE IngredientID = :ingredient_id")
        with db.engine.connect() as conn:
            conn.execute(delete_ingredient_cmd, ingredient_id=ingredient_id)

        negate_count = ingredient_count * -1
        log_message = f"INGREDIENT COUNT SET TO 0: DELETED INGREDIENT WITH ID {ingredient_id}"
        insert_log_cmd = text("INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES (:ingredient_id, :negate_count, :log_message, NOW())")
        with db.engine.connect() as conn:
            conn.execute(insert_log_cmd, ingredient_id=ingredient_id, negate_count=negate_count, log_message=log_message)

        return jsonify({"message": "Ingredient deleted successfully"})





@api.route('/api/manager/createmenuitem')
class CreateMenuItem(Resource):
    def post(self):
        data = request.get_json()
        new_id = data.get("newID")
        menu_item_name = data.get("menuItemName")
        price = data.get("price")
        
        add_menu_item_cmd = text("INSERT INTO MenuItems (MenuID, ItemName, Price) VALUES (:new_id, :menu_item_name, :price)")
        try:
            with db.engine.connect() as conn:
                conn.execute(add_menu_item_cmd, new_id=new_id, menu_item_name=menu_item_name, price=price)
        except Exception as e:
            print(e)
            return jsonify({"message": "Failed to add menu item"})
        
        return jsonify({"message": "Menu item added successfully"})

@api.route('/api/manager/deletemenuitem/<int:menu_item_id>')
class DeleteMenuItem(Resource):
    def delete(self, menu_item_id):
        delete_cmd = text("DELETE FROM menuitemIngredients WHERE MenuID = :menu_item_id")
        with db.engine.connect() as conn:
            conn.execute(delete_cmd, menu_item_id=menu_item_id)
        
        delete_cmd = text("DELETE FROM menuitems WHERE MenuID = :menu_item_id")
        with db.engine.connect() as conn:
            conn.execute(delete_cmd, menu_item_id=menu_item_id)
        
        return jsonify({"message": "Menu item deleted successfully"})

@api.route('/api/manager/editmenuitem/<int:menu_item_id>')
class EditMenuItem(Resource):
    def put(self, menu_item_id):
        data = request.get_json()
        new_name = data.get("newName")
        new_price = data.get("newPrice")
        
        if new_name:
            update_name_cmd = text("UPDATE menuItems SET itemname = :new_name WHERE menuid = :menu_item_id")
            with db.engine.connect() as conn:
                conn.execute(update_name_cmd, new_name=new_name, menu_item_id=menu_item_id)
        
        if new_price is not None and new_price > 0:
            update_price_cmd = text("UPDATE menuitems SET price = :new_price WHERE menuid = :menu_item_id")
            with db.engine.connect() as conn:
                conn.execute(update_price_cmd, new_price=new_price, menu_item_id=menu_item_id)
        
        return jsonify({"message": "Menu item updated successfully"})


def init():
    return 