"""
This module defines RESTful API resources for managing menu items, orders, employee information, and other related operations in the RevsPos application.

It imports necessary modules from Flask, Flask-RESTx, and SQLAlchemy.

Classes:
    - CompleteOrder: Defines a resource for marking an order as completed.
    - GetInProgressOrders: Defines a resource for retrieving in-progress orders.
    - Employee: Defines a resource for retrieving employee information.
    - MenuItems: Defines a resource for managing menu items.
    - Ingredients: Defines a resource for managing ingredients.
    - MenuItemIngredients: Defines a resource for managing ingredients for menu items.
    - MenuItemCustomizations: Defines a resource for managing customizations for menu items.
    - OrderHistory: Defines a resource for managing order history.
    - OrderStatusCompleted: Defines API routes for updating the status of completed orders managed by managers.
    - OrderStatusInprogress: Defines API routes for updating the status of in-progress orders managed by managers.
    - OrderStatusDeleted: Defines API routes for updating the status of deleted orders managed by managers.
    - OrderStatusCanceled: Defines API routes for updating the status of canceled orders managed by managers.
    - RestockAll: Defines API routes for restocking all ingredients below the recommended amount.
    - RestockSome: Defines API routes for restocking specified ingredients below the recommended amount.
    - RestockByLocation: Defines API routes for restocking ingredients below the recommended amount in a specified location.
    - GenerateProductUsage: Defines API routes for generating a product usage report (ingredients' change in inventory amounts over a period of time).
    - GenerateSalesReport: Defines API routes for generating a sales report (menu items' change in sale over a period of time).
    - GenerateExcessReport: Defines API routes for generating an excess report (menu items' that have ingredients that have sold less than 10% over a period of time).
    - GenerateRestockReport: Defines API routes for generating a restock report (ingredients that have less than the their minimum amount).
    - GenerateOrderTrend: Defines API routes for generating an order trend report (top ten menu items ordered together).
    
Attributes:
    - api: Represents the Flask-RESTx API instance.
    - db: Represents the database instance.

Models:
    - AddMenuItem_model: Defines a model for adding a menu item.
    - UpdateMenuItem_model: Defines a model for updating a menu item.
    - DeleteMenuItem_model: Defines a model for deleting a menu item.
    - AddIngredient_model: Defines a model for adding an ingredient.
    - UpdateIngredient_model: Defines a model for updating an ingredient.
    - DeleteIngredient_model: Defines a model for deleting an ingredient.
    - GetIngredientsFromMenuItem_model: Defines a model for retrieving ingredients from a menu item.
    - AddIngredientToMenuItem_model: Defines a model for adding an ingredient to a menu item.
    - DeleteIngredientFromMenuItem_model: Defines a model for deleting an ingredient from a menu item.
    - GetCustomizationsFromMenuItem_model: Defines a model for retrieving customizations from a menu item.
    - AddCustomizationToMenuItem_model: Defines a model for adding a customization to a menu item.
    - DeleteCustomizationFromMenuItem_model: Defines a model for deleting a customization from a menu item.
    - UpdateOrder_model: Defines a model for updating an order.
    - DeleteOrder_model: Defines a model for deleting an order.
    - OrderStatus_model: Defines a model for representing order status.
    - RestockSome_model: Defines a model for restocking some ingredients.
    - RestockByLocation_model: Defines a model for restocking ingredients by location.
    - GenerateExcessReport_model: Defines a model for generating an excess report.
    - GenerateProductUsage_model: Defines a model for generating a product usage report.
    - GenerateSalesReport_model: Defines a model for generating a sales report.
    - GenerateOrderTrend_model: Defines a model for generating an order trend report.
    - CompleteOrder_model: Defines a model for marking an order as completed.

Methods:
    - post: Handles HTTP POST requests.
    - get: Handles HTTP GET requests.
    - put: Handles HTTP PUT requests.
    - delete: Handles HTTP DELETE requests.

"""

from flask import request, jsonify
from flask_restx import  Resource, fields
from sqlalchemy import text
from sqlalchemy.exc import ObjectNotExecutableError
from .api_master import api, db

AddMenuItem_model = api.model('AddMenuItem', {"category":fields.Integer(required=True), "itemname":fields.String(required=True, min_length=3, max_length=30), "price":fields.Float(required=True)})
UpdateMenuItem_model = api.model('UpdateMenuItem', {"menuid":fields.Integer(required=True), "itemname":fields.String(min_length=3, max_length=30), "price":fields.Float})
DeleteMenuItem_model = api.model('DeleteMenuItem', {"menuid":fields.Integer(required=True)})

AddIngredient_model = api.model('AddIngredient', { "ingredientname":fields.String(min_length=3,max_length=30,required=True), "count":fields.Integer(required=True), "ppu":fields.Float(required=True), "minamount":fields.Integer(required=True), "location":fields.String(required=True,min_length=6,max_length=7),"recommendedamount":fields.Integer(required=True),"caseamount":fields.Integer(required=True)})
UpdateIngredient_model = api.model('UpdateIngredient', {"ingredientid":fields.Integer(required=True), "ingredientname":fields.String(min_length=3,max_length=30), "count":fields.Integer, "ppu":fields.Float, "minamount":fields.Integer, "location":fields.String(min_length=6,max_length=7),"recommendedamount":fields.Integer,"caseamount":fields.Integer})
DeleteIngredient_model = api.model('DeleteIngredient', {"ingredientid":fields.Integer(required=True), "count":fields.Integer(required=True)})

GetIngredientsFromMenuItem_model = api.model('GetIngredientsFromMenuItem', {"menuitemid":fields.Integer(required=True)})
AddIngredientToMenuItem_model = api.model('AddIngredientToMenuItem', {"menuitemid":fields.Integer(required=True), "ingredientid":fields.Integer(required=True)})
DeleteIngredientFromMenuItem_model = api.model('DeleteIngredientFromMenuItem', {"menuitemid":fields.Integer(required=True), "ingredientid":fields.Integer(required=True)})

GetCustomizationsFromMenuItem_model = api.model('GetCustomizationsFromMenuItem', {"menuitemid":fields.Integer(required=True)})
AddCustomizationToMenuItem_model = api.model('AddCustomizationToMenuItem', {"menuitemid":fields.Integer(required=True), "customizationid":fields.Integer(required=True)})
DeleteCustomizationFromMenuItem_model = api.model('DeleteCustomizationFromMenuItem', {"menuitemid":fields.Integer(required=True), "customizationid":fields.Integer(required=True)})

# GetOrder_model = api.model('GetOrder', {"orderid":fields.Integer, "numberOfOutputs":fields.Integer})
UpdateOrder_model = api.model('UpdateOrder', {"orderid":fields.Integer(required=True), "customername":fields.String(min_length=3, max_length=25), "baseprice":fields.Float, "employeeid":fields.Integer})
DeleteOrder_model = api.model('DeleteOrder', {"orderid":fields.Integer(required=True)})

OrderStatus_model = api.model('OrderStatusComplete', {"orderid":fields.Integer(required=True)})

RestockSome_model = api.model('RestockSome', {'ingredientids': fields.List(fields.Integer,required=True)})
RestockByLocation_model = api.model('RestockByLocation', {'location':fields.String(min_length=6,max_length=7,required=True)})

GenerateExcessReport_model = api.model('GenerateExcessReport',{"startdate": fields.Date(required=True)})
GenerateProductUsage_model = api.model('GenerateProductUsage',{"startdate": fields.Date(required=True), "enddate": fields.Date(required=True)})
GenerateSalesReport_model = api.model('GenerateSalesReport',{"startdate": fields.Date(required=True), "enddate": fields.Date(required=True)})
GenerateOrderTrend_model = api.model('GenerateOrderTrend',{"startdate": fields.Date(required=True), "enddate": fields.Date(required=True)})

CompleteOrder_model = api.model('CompleteOrder',{"orderid":fields.Integer(required=True)})


AddEmployee_model = api.model('AddEmployee', { "employeeName":fields.String(required=True), "employeeEmail":fields.String(required=True), "isManager":fields.Boolean(required=True), "salary":fields.Float(required=True), "password":fields.String(required=True)})
UpdateEmployee_model = api.model('UpdateEmploy', {"employeeid":fields.Integer(required=True), "employeeName":fields.String(),"employeeEmail":fields.String(required=True), "isManager":fields.Boolean(), "salary":fields.Float(), "password":fields.String()})
DeleteEmployee_model = api.model('DeleteEmployee',{'employeeid':fields.Integer(required=True)})

@api.route('/api/kitchen/completeorder')
class CompleteOrder(Resource):
    """
    Resource for marking an order as completed.
    """

    @api.expect(CompleteOrder_model, validate=True)
    def post(self):
        """
        POST method for marking an order as completed.
        """
        data = request.get_json()
        orderid = data.get("orderid")
        with db.engine.connect() as conn:
            conn.connection.cursor().execute(f"UPDATE ORDERS SET ORDERSTAT = 'completed' WHERE ORDERID = {orderid};")
            conn.connection.commit()
        

@api.route('/api/kitchen/getinprogressorders')
class GetInProgressOrders(Resource):
    """
    Resource for retrieving in-progress orders.
    """

    def get(self):
        """
        GET method for retrieving in-progress orders.
        """
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("SELECT * FROM ORDERS WHERE ORDERSTAT = 'inprogress' ORDER BY ORDERID;"))
            orderlist = []
            for row in result:
                order = {}
                order['orderid'] = row.orderid
                order['customername'] = row.customername
                orderlist.append(order)
                menuitems = []
                menuresult = conn.execution_options(stream_results=True).execute(text(f"SELECT menuitems.itemname, customizationID FROM orders JOIN ordermenuitems ON ordermenuitems.orderID = orders.orderID JOIN menuitems ON ordermenuitems.menuID = menuitems.menuID where orders.orderID = {row.orderid};"))
                for row2 in menuresult:
                    menuitem = {}
                    menuitem['menuitemname'] = row2.itemname   
                    if(row2.customizationid != None):
                        custresult = conn.execution_options(stream_results=True).execute(text(f"SELECT customizationID,ingredients.ingredientname AS WantedCustimzation FROM ordermenuitems JOIN customizationordermenu ON ordermenuitems.customizationID = customizationordermenu.customizationordermenuID JOIN ingredients ON customizationordermenu.ingredientID = ingredients.ingredientID JOIN menuitems ON ordermenuitems.menuID = menuitems.menuID WHERE customizationid = {row2.customizationid};"))
                        custs = []
                        for row3 in custresult:
                            custs.append(row3.wantedcustimzation)
                        menuitem['customizations'] = custs
                    menuitems.append(menuitem)
                order['menuitems'] = menuitems
            return jsonify(orderlist)
        


@api.route('/api/manager/employee')
class Employee(Resource):
    """
    Resource for retrieving employee information.
    """

    def get(self):
        """
        GET method for retrieving employee information.
        """
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from employee"))
            employeelist = []
            for row in result:
                employeelist.append({"employeeid":row.employeeid, "employeename":row.employeename, "ismanager":row.ismanager, "salary":row.salary, "password":row.password})
        return jsonify(employeelist)

    @api.expect(AddEmployee_model, validate=True)
    def post(self):
        """
        POST method for adding a new employee.
        """
        data = request.get_json()
        name = data.get("employeeName")
        email = data.get("employeeEmail")
        isManager = data.get("isManager")
        salary = data.get("salary")
        password = data.get("password")
        add_employee_query = text("INSERT INTO employee ( EmployeeName,employeeEmail, IsManager, Salary, Password)  VALUES ('{inname}','{inemail}', {inismanager}, {insalary},'{inpass}')".format(inname = name,inemail=email, inismanager=isManager, insalary=salary,inpass = password))
        
        with db.engine.connect() as conn:
            conn.execute(add_employee_query)
            conn.commit()
        #except Exception as e:
            # print(e)
            #return jsonify({"message": "Failed to add employee"})
        
        return jsonify({"message": "Sucessfully added Employee"})
    

    @api.expect(UpdateEmployee_model, validate=True)
    def put(self):
        """
        PUT method for updating employee information.
        """
        data = request.get_json()
        empid = data.get("employeeid")
        name = data.get("employeeName")
        email = data.get("employeeEmail")
        isManager = data.get("isManager")
        salary = data.get("salary")
        password = data.get("password")

        if(name == None and email == None and isManager == None and salary == None and password == None):
            return jsonify({"message": "No inputs entered. No query executed."})

        update_query = "UPDATE employee SET "
        if (name != None):
            update_query += "employeeName = '{inputname}',".format(inputname=name)
        if (email != None):
            update_query += "employeeEmail = '{inputemail}',".format(inputemail=email)
        if (isManager != None):
            update_query += "ismanager = {inputisman},".format(inputisman=isManager)
        if (salary != None):
            update_query += "salary = {inputsalary},".format(inputsalary=salary)
        if (password != None):
            update_query += "password = '{inputpassword}',".format(inputpassword=password)

        update_query = update_query[:-1]
        update_query += " WHERE employeeid = {inputemployeeid}".format(inputemployeeid=empid)

        with db.engine.connect() as conn:
            conn.execute(text(update_query))
            conn.commit()
        return jsonify({"message": "successful update of employee"})

    @api.expect(DeleteEmployee_model, validate=True)
    def delete(self):
        """
        DELETE method for deleting an employee.
        """
        employeeid = request.get_json().get("employeeid")

        delete_employee_query = "DELETE FROM employee WHERE EmployeeID = {inputempid}".format(inputempid=employeeid)
        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_employee_query)
            conn.connection.commit()
        
        return jsonify({"message": "Sucessfully deleted employee with employeeid = {inputempid}".format(inputempid=employeeid)})

@api.route('/api/manager/menuitems')
class MenuItems(Resource):
    """
    Resource for retrieving menu item information.
    """

    def get(self): #GetMenuItem
        """
        GET method for retrieving menu item information.
        """
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from menuitems"))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"menuid":row.menuid, "itemname":row.itemname, "price":row.price, "picturepath":row.picturepath})
        return jsonify(menuitemlist)
    
    @api.expect(AddMenuItem_model, validate=False)
    def post(self): #AddMenuItem
        """
        POST method for creating menu item information.
        """
        # print("GOT HERE")
        data = request.get_json()
        category = data.get("category")
        itemname = data.get("itemname")
        price = data.get("price")
        menuid = 0

        select_query = text("SELECT MENUID FROM MENUITEMS WHERE MENUID BETWEEN {lowerbound} AND {upperbound} ORDER BY MENUID DESC LIMIT 1;".format(lowerbound = category,upperbound = int(category) + 100))
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(select_query)
            for row in result:
                menuid = row.menuid + 1

        add_menu_item_query = text("INSERT INTO MenuItems (MenuID, ItemName, Price) VALUES ({inputmenuid}, '{inputitemname}', {inputprice})".format(inputmenuid=menuid, inputitemname=itemname, inputprice=price))
        try:
            with db.engine.connect() as conn:
                conn.execute(add_menu_item_query)
                conn.commit()
        except Exception as e:
            # print(e)
            return jsonify({"message": "Failed to add menu item"})
        
        return jsonify({"message": "Sucessfully added Menu item with menuid = {inputmenuid}".format(inputmenuid=menuid)})
    
    @api.expect(UpdateMenuItem_model, validate=True)
    def put(self): #UpdateMenuItem
        """
        PUT method for updating menu item information.
        """
        data = request.get_json()
        menuid = data.get("menuid")
        itemname = data.get("itemname")
        price = data.get("price")

        if (menuid == 0):
            return jsonify({"message": "No Menu Item ID entered. No query executed."})
        elif (itemname == "string" and price == 0):
            return jsonify({"message": "No inputs entered. No query executed."})
        
        update_query = "UPDATE menuitems SET "
        if (itemname != "string"):
            update_query += "itemname = '{inputnewname}',".format(inputnewname=itemname)
        if (price > 0):
            update_query += "price = {inputnewprice},".format(inputnewprice=price)

        update_query = update_query[:-1]
        update_query += " WHERE menuid = {inputmenuidid}".format(inputmenuidid=menuid)

        with db.engine.connect() as conn:
            result = conn.execute(text(update_query))
            conn.commit()
        return jsonify({"message": "successful update of menu item with menuid = {inputmenuid}".format(inputmenuid=menuid)})

    @api.expect(DeleteMenuItem_model, validate=True)
    def delete(self): #DeleteMenuItem #TODO: need to do a check where the menuid actually exists first before doing queries. Success msg is wrongfully shown when deleting menuid that doesnt exist in the db
        """
        DELETE method for deleting menu item information.
        """
        menuid = request.get_json().get("menuid")

        delete_menuitemingredients_query = "DELETE FROM menuitemIngredients WHERE MenuID = {inputmenuid}".format(inputmenuid=menuid)
        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_menuitemingredients_query)
            conn.connection.commit()
        
        delete_menuitem_query = "DELETE FROM menuitems WHERE MenuID = {inputmenuid}".format(inputmenuid=menuid)
        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_menuitem_query)
            conn.connection.commit()
        
        return jsonify({"message": "Sucessfully deleted Menu item with menuid = {inputmenuid}".format(inputmenuid=menuid)})

@api.route('/api/manager/ingredients')
class Ingredients(Resource):
    """
    Resource for retrieving ingredient information.
    """

    def get(self): #GetIngredients
        """
        GET method for retrieving ingredient information.
        """
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text("select * from ingredients"))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount,"location":row.location,"recommendedamount":row.recommendedamount,"caseamount":row.caseamount})
        return jsonify(menuitemlist)
    
    @api.expect(AddIngredient_model, validate=True)
    def post(self): #AddIngredient
        """
        POST method for creating menu item information.
        """
        data = request.get_json()

        ingredientname = data.get("ingredientname")
        count = data.get("count")
        ppu = data.get("ppu")
        minamount = data.get("minamount")
        location = data.get("location")
        recommendedamount = data.get("recommendedamount")
        caseamount = data.get("caseamount")

        
        if (ingredientname == "string" or count == 0 or ppu == 0 or minamount == 0 or location == 'string' or recommendedamount == 0 or caseamount == 0):
            return jsonify({"message":"failed to insert ingredient. Missing fields. All fields are required."})
        
        insert_query = text("INSERT INTO Ingredients (Ingredientname, Count, PPU, minamount, location, recommendedamount, caseamount) VALUES ('{inputingredientname}', {inputcount}, {inputppu}, {inputminamount}, '{inputlocation}', {inputrecamt}, {inputcaseamt})".format(inputingredientname=ingredientname,inputcount=count,inputppu=ppu, inputminamount=minamount,inputlocation=location,inputrecamt=recommendedamount,inputcaseamt=caseamount))
        with db.engine.connect() as conn:
            conn.execute(insert_query)
            conn.commit()
        return jsonify({"message":"Sucessfully inserted the ingredient with ingredientname = {inputingredientname}".format(inputingredientname=ingredientname)})

    @api.expect(UpdateIngredient_model, validate=True)
    def put(self): #UpdateIngredient
        """
        PUT method for updating menu item information.
        """
        data = request.get_json()
        ingredientid = data.get("ingredientid")
        newname = data.get("ingredientname")
        newcount = data.get("count")
        newppu = data.get("ppu")
        newminamount = data.get("minamount")
        newloc = data.get("location")
        newrecamt = data.get("recommendedamount")
        newcaseamt = data.get("caseamount")
        
        if (ingredientid == 0):
            return jsonify({"message": "No ingredientid entered. No query executed."})
        elif (newname == "string" and newcount == 0 and newppu == 0 and newminamount == 0 and newloc == "string" and newrecamt == 0 and newcaseamt == 0):
            return jsonify({"message": "No inputs entered. No query executed."})

        update_query = "UPDATE ingredients SET "
        if (newname != "string"):
            update_query += "ingredientname = '{inputnewname}',".format(inputnewname=newname)
        if (newcount > 0):
            update_query += "count = {inputnewcount},".format(inputnewcount=newcount)
        if (newppu > 0):
            update_query += "ppu = {inputnewppu},".format(inputnewppu=newppu)
        if (newminamount > 0):
            update_query += "minamount = {inputnewminamount},".format(inputnewminamount=newminamount)
        if (newloc != "string"):
            update_query += "location = '{inputloc}',".format(inputloc=newloc)
        if (newrecamt > 0):
            update_query += "recommendedamount = {inputrecamt},".format(inputrecamt=newrecamt)
        if (newcaseamt > 0):
            update_query += "caseamount = {inputcaseamt},".format(inputcaseamt=newcaseamt)
        
        update_query = update_query[:-1]
        update_query += " WHERE IngredientID = {inputingredientid}".format(inputingredientid=ingredientid)
        try:
            with db.engine.connect() as conn:
                conn.execute(text(update_query))
                conn.commit()
                return jsonify({"message": "successful update of ingredient with ingredientid = {inputingredientid}".format(inputingredientid=ingredientid)})
        except ObjectNotExecutableError:
            return jsonify({"message":"failed to find ingredient with ingredientid = {inputingredientid}".format(inputingredientid=ingredientid)})
    
    @api.expect(DeleteIngredient_model, validate=True)
    def delete(self): #DeleteIngredient #TODO: FIX THIS ONE. THERE'S A TON OF EXECUTES AND NO ERROR CHECKING, 
        """
        DELETE method for deleting menu item information.
        """
        data = request.get_json()
        ingredientid = data.get("ingredientid")
        count = data.get("count")

        delete_from_join_cmd = "DELETE FROM MenuItemIngredients WHERE IngredientID = {inputingredientid}".format(inputingredientid=ingredientid)
        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_from_join_cmd)
            conn.connection.commit()

        delete_ingredient_cmd = "DELETE FROM Ingredients WHERE IngredientID = {inputingredientid}".format(inputingredientid=ingredientid)
        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_ingredient_cmd)
            conn.connection.commit()

        negate_count = count * -1
        log_message = "INGREDIENT COUNT SET TO 0: DELETED INGREDIENT WITH INGREDIENTID = {inputingredientid}".format(inputingredientid=ingredientid)

        insert_log_cmd = text("INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ({inputingredientid}, {inputnegate_count}, '{inputlog_message}', NOW())".format(inputingredientid=ingredientid, inputnegate_count=negate_count, inputlog_message=log_message))
        try:         
            with db.engine.connect() as conn:
                conn.execute(insert_log_cmd)
                conn.commit()
            return jsonify({"message": "successful deletion of ingredient with ingredientid = {inputingredientid}".format(inputingredientid=ingredientid)})
        except ObjectNotExecutableError as e:
            return jsonify({"message":"failed to delete ingredient with ingredientid = {inputingredientid}".format(inputingredientid=ingredientid)})

@api.route('/api/manager/menuitemingredients')
class MenuItemIngredients(Resource):
    """
    Resource for retrieving menuitem-ingredient join table information.
    """
    @api.expect(GetIngredientsFromMenuItem_model, validate=True)
    def put(self): #GetIngredientFromMenuItem
        """
        PUT method for retrieving ingredient information from a menu item.
        """
        with db.engine.connect() as conn:
            menuitemid = request.get_json().get("menuitemid") 
            result = conn.execution_options(stream_results=True).execute(text("SELECT Ingredients.IngredientID, Ingredients.IngredientName " +
                "FROM menuitems JOIN menuitemingredients ON menuitems.MenuID = menuitemingredients.MenuID " +
                "JOIN Ingredients ON menuitemingredients.IngredientID = Ingredients.IngredientID " +
                "WHERE menuitems.MenuID = {inputmenuitemid}".format(inputmenuitemid = menuitemid)))
            menuitemingredientslist = []
            for row in result:
                menuitemingredientslist.append({"ingredientname":row.ingredientname, "ingredientid":row.ingredientid})
        return jsonify(menuitemingredientslist)
    
    @api.expect(AddIngredientToMenuItem_model, validate=True)
    def post(self): #AddIngredientToMenuItem
        """
        POST method for creating ingredient information for a menu item.
        """
        menuitemid = request.get_json().get("menuitemid") 
        ingredientid = request.get_json().get("ingredientid") 

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
    def delete(self): 
        """
        DELETE method for deleting ingredient information from a menu item.
        """
        menuitemid = request.get_json().get("menuitemid") 
        ingredientid = request.get_json().get("ingredientid") 

        delete_ingredient_query = "DELETE FROM menuitemIngredients WHERE MenuID={inputmenuitemid} AND ingredientID={inputingredientid}".format(inputmenuitemid = menuitemid, inputingredientid = ingredientid)

        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_ingredient_query)
            conn.connection.commit()
            return jsonify({"message":"successfully deleted order with menuid = {inputmenuitemid} and ingredient = {inputingredientid}".format(inputmenuitemid = menuitemid, inputingredientid = ingredientid)})

@api.route('/api/manager/menuitemcustomizations')
class MenuItemCustomizations(Resource):
    """
    Resource for retrieving menuitem-customizations join table information.
    """
    @api.expect(GetCustomizationsFromMenuItem_model, validate=True)
    def put(self): #GetCustomizationsFromMenuItem
        """
        PUT method for retrieving customization information from a menu item.
        """
        with db.engine.connect() as conn:
            menuitemid = request.get_json().get("menuitemid") 
            result = conn.execution_options(stream_results=True).execute(text("SELECT Ingredients.IngredientID, Ingredients.IngredientName " +
                "FROM menuitems JOIN menuitemcustomizations ON menuitems.MenuID = menuitemcustomizations.MenuID " +
                "JOIN Ingredients ON menuitemcustomizations.CustomizationID = Ingredients.IngredientID " +
                "WHERE menuitems.MenuID = {inputmenuitemid}".format(inputmenuitemid = menuitemid)))
            menuitemingredientslist = []
            for row in result:
                menuitemingredientslist.append({"ingredientname":row.ingredientname, "ingredientid":row.ingredientid})
        return jsonify(menuitemingredientslist)
    
    @api.expect(AddCustomizationToMenuItem_model, validate=True)
    def post(self): #AddCustomizationToMenuItem
        """
        POST method for creating customization information for a menu item.
        """
        menuitemid = request.get_json().get("menuitemid") 
        customizationid = request.get_json().get("customizationid") 

        add_customization_query = "INSERT INTO menuitemCustomizations (MenuID, CustomizationID) values ({inputmenuitemid},{inputcustomizationid})".format(inputmenuitemid = menuitemid, inputcustomizationid = customizationid)
                   
        with db.engine.connect() as conn:
            result = conn.execute(text(add_customization_query)) #execution_options(stream_results=True).
            conn.commit()

            select_add_customization_query = "SELECT * FROM menuitemcustomizations WHERE menuid = {inputmenuitemid}".format(inputmenuitemid = menuitemid)
            resultselect = conn.execution_options(stream_results=True).execute(text(select_add_customization_query))
            menuitemcustomizationslist = []
            for row in resultselect:
                menuitemcustomizationslist.append({"menuid":row.menuid,"customizationid":row.customizationid})
        return jsonify(menuitemcustomizationslist)
    
    @api.expect(DeleteCustomizationFromMenuItem_model, validate=True)
    def delete(self): #DeleteCustomizationFromMenuItem
        """
        DELETE method for deleting customization information from a menu item.
        """
        menuitemid = request.get_json().get("menuitemid") 
        customizationid = request.get_json().get("customizationid") 

        delete_customization_query = "DELETE FROM menuitemCustomizations WHERE MenuID={inputmenuitemid} AND customizationID={inputcustomizationid}".format(inputmenuitemid = menuitemid, inputcustomizationid = customizationid)

        with db.engine.connect() as conn:
            conn.connection.cursor().execute(delete_customization_query)
            conn.connection.commit()
            return jsonify({"message":"successfully deleted order with menuid = {inputmenuitemid} and customizationid = {inputcustomizationid}".format(inputmenuitemid = menuitemid, inputcustomizationid = customizationid)})

@api.route('/api/manager/orderhistory')
class OrderHistory(Resource):
    """
    Resource for retrieving order history information.
    """
    def get(self):
        """
        GET method for retrieving order history information.
        """
        with db.engine.connect() as conn:
            limit_query = "LIMIT 100"
            get_order_query = "SELECT * FROM orders {inputquery}".format(inputquery=limit_query)
            result = conn.execution_options(stream_results=True).execute(text(get_order_query))
            orderlist = []
            for row in result:
                orderlist.append({"orderid":row.orderid, "customername":row.customername, "taxprice":row.taxprice,"baseprice":row.baseprice,"orderdatetime":row.orderdatetime,"employeeid":row.employeeid})
        return jsonify(orderlist)
    
    @api.expect(UpdateOrder_model, validate=True)
    def put(self): 
        """
        PUT method for updating order history information.
        """
        orderid = request.get_json().get("orderid") 
        customername = request.get_json().get("customername")
        baseprice = request.get_json().get("baseprice") 
        employeeid = request.get_json().get("employeeid") 

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
            result = conn.execute(text(update_order_query)) 
            conn.commit()
        return jsonify({"message": "Successfully updated order history with orderid = {inputorderid}.".format(inputorderid=orderid)})
    
    @api.expect(DeleteOrder_model, validate=True)
    def delete(self): 
        """
        DELETE method for deleting order history information.
        """
        orderid = request.get_json().get("orderid") #
        if (orderid >= 0):
            delete_order_query = "DELETE FROM Orders WHERE orderid = {inputorderid}".format(inputorderid = orderid)
        else: 
            #TODO: check for other ways to get failure
            return jsonify({"message":"failed to deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})
        with db.engine.connect() as conn:
            result_cursor = conn.connection.cursor().execute(delete_order_query)
        
            conn.connection.commit()

            try:
                if (result_cursor is None):
                    return jsonify({"message":"successfully deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})
            except:
                return jsonify({"message":"failed to deleted order with orderid = {inputorderid}".format(inputorderid = orderid)})





@api.route('/api/manager/orderstatuscompleted')
class OrderStatusCompleted(Resource):
    """
    Defines API routes for updating the status of completed orders managed by managers.
    """
    @api.expect(OrderStatus_model, validate=True)
    def put(self): 
        """
        PUT method for updating the status of an order to 'completed'.
        """
        orderid = request.get_json().get("orderid") 

        if (orderid == 0):
            return jsonify({"message": "No orderid entered. No query executed."})
        
        update_order_query = "UPDATE orders SET orderstat = 'completed' where orderid = {inputorderid}".format(inputorderid=orderid)
        
        with db.engine.connect() as conn:
            conn.execute(text(update_order_query)) 
            conn.commit()
        return jsonify({"message": "Set order status to COMPLETED for orderid = {inputorderid}.".format(inputorderid=orderid)})

@api.route('/api/manager/orderstatusinprogress')
class OrderStatusInprogress(Resource):
    """
    Defines API routes for updating the status of in-progress orders managed by managers.
    """
    @api.expect(OrderStatus_model, validate=True)
    def put(self): 
        """
        PUT method for updating the status of an order to 'inprogress'.
        """
        orderid = request.get_json().get("orderid") 

        if (orderid == 0):
            return jsonify({"message": "No orderid entered. No query executed."})
        
        update_order_query = "UPDATE orders SET orderstat = 'inprogress' where orderid = {inputorderid}".format(inputorderid=orderid)
        
        with db.engine.connect() as conn:
            conn.execute(text(update_order_query)) 
            conn.commit()
        return jsonify({"message": "Set order status to INPROGRESS for orderid = {inputorderid}.".format(inputorderid=orderid)})

@api.route('/api/manager/orderstatusdeleted')
class OrderStatusDeleted(Resource):
    """
    Defines API routes for updating the status of deleted orders managed by managers.
    """
    @api.expect(OrderStatus_model, validate=True)
    def put(self): 
        """
        PUT method for updating the status of an order to 'deleted'.
        """
        orderid = request.get_json().get("orderid") 

        if (orderid == 0):
            return jsonify({"message": "No orderid entered. No query executed."})
        
        update_order_query = "UPDATE orders SET orderstat = 'deleted' where orderid = {inputorderid}".format(inputorderid=orderid)
        
        with db.engine.connect() as conn:
            conn.execute(text(update_order_query)) 
            conn.commit()
        return jsonify({"message": "Set order status to DELETED for orderid = {inputorderid}.".format(inputorderid=orderid)})

@api.route('/api/manager/orderstatuscanceled')
class OrderStatusCanceled(Resource):
    """
    Defines API routes for updating the status of canceled orders managed by managers.
    """
    @api.expect(OrderStatus_model, validate=True)
    def put(self): 
        """
        PUT method for updating the status of an order to 'canceled'.
        """
        orderid = request.get_json().get("orderid") 

        if (orderid == 0):
            return jsonify({"message": "No orderid entered. No query executed."})
        
        update_order_query = "UPDATE orders SET orderstat = 'canceled' where orderid = {inputorderid}".format(inputorderid=orderid)
        
        with db.engine.connect() as conn:
            conn.execute(text(update_order_query)) 
            conn.commit()
        return jsonify({"message": "Set order status to CANCELED for orderid = {inputorderid}.".format(inputorderid=orderid)})





@api.route('/api/manager/restockall')
class RestockAll(Resource):
    """
    Defines API routes for restocking all ingredients below the recommended amount.
    """
    def get(self): #get all that needs to be restocked
        """
        GET method for retrieving all ingredients that need to be restocked.
        """
        with db.engine.connect() as conn:
            get_stmt = "select * from ingredients where count < recommendedamount"
            result = conn.execution_options(stream_results=True).execute(text(get_stmt))
            # ingrdientlist = []
            restocklist = []
            for row in result:
                # print(str(row))
                casestobuy = int((row.recommendedamount - row.count) / row.caseamount) + 1
                stockincrease = casestobuy*row.caseamount
                restocklist.append({"message":"Need "+str(casestobuy)+" cases for "+str(stockincrease)+" total units of ingredient "+str(row.ingredientname)+". Inventory not affected. No restock occurred."})
            conn.connection.commit()
            if (len(restocklist) == 0):
                return jsonify({"message": "No inventory is below recommended amount."})
                # ingrdientlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount,"location":row.location,"recommendedamount":row.recommendedamount, "caseamount":row.caseamount})
        # return jsonify(ingrdientlist)
        return jsonify(restocklist)
    
    # @api.expect(RestockAll_model, validate=True)
    def put(self): #"update" restock all
        """
        PUT method for updating all ingredients that need to be restocked.
        """
        with db.engine.connect() as conn:
            get_stmt = "select * from ingredients where count < recommendedamount"
            result = conn.execution_options(stream_results=True).execute(text(get_stmt))
            # ingrdientlist = []
            restocklist = []
            upIng = ''
            logIng = ''
            for row in result:
                # print(str(row))
                casestobuy = int((row.recommendedamount - row.count) / row.caseamount) + 1
                stockincrease = casestobuy*row.caseamount
                logMessage = 'RESTOCK ALL: BOUGHT {x} CASES FOR INGREDIENTID = {y}'.format(x=casestobuy,y=row.ingredientid)
                upIng += "UPDATE Ingredients SET Count = Count + "+ str(stockincrease) + " WHERE IngredientID = " + str(row.ingredientid) + "; "
                logIng += "INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ("+ str(row.ingredientid)+", "+str(stockincrease)+", '"+logMessage+"', NOW()); "
                # restocklist.append({"ingredientid":row.ingredientid, "casesbought":casestobuy,"stockincrease":stockincrease,"message":"Inventory changed. Restock successfull."})
                restocklist.append({"message":"Ordered "+str(casestobuy)+" cases for "+str(stockincrease)+" total units of ingredient "+str(row.ingredientname)+". Inventory changed. Restock successfull."})
            if (upIng == "" or logIng == ""):
                return jsonify({"message": "No inventory is below recommended amount. No query executed."})
            conn.connection.cursor().execute(upIng)
            conn.connection.cursor().execute(logIng)
            conn.connection.commit()
                # ingrdientlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount,"location":row.location,"recommendedamount":row.recommendedamount, "caseamount":row.caseamount})
        # return jsonify(ingrdientlist)
        return jsonify(restocklist)

@api.route('/api/manager/restocksome')
class RestockSome(Resource):
    """
    Defines API routes for restocking specified ingredients below the recommended amount.
    """
    @api.expect(RestockSome_model, validate=True)
    def post(self): #get restock some
        """
        POST method for retrieving ingredients that need to be restocked from a specified list.
        """
        ingr_list = request.get_json().get("ingredientids", [])
        allingredients = ""
        for id in ingr_list:
            allingredients += "ingredientid = " + str(id) + " or "
        allingredients = allingredients[:-3]
        allingredients += ")"
        # ingredientid = request.get_json().get("ingredientid") 
        with db.engine.connect() as conn:
            get_stmt = "select * from ingredients where count < recommendedamount and ({x}".format(x=allingredients)
            result = conn.execution_options(stream_results=True).execute(text(get_stmt))
            restocklist = []
            for row in result:
                casestobuy = int((row.recommendedamount - row.count) / row.caseamount) + 1
                stockincrease = casestobuy*row.caseamount
                # restocklist.append({"ingredientid":row.ingredientid, "casesbought":casestobuy,"stockincrease":stockincrease,"message":"Inventory not affected. No restock occurred."})
                restocklist.append({"message":"Need "+str(casestobuy)+" cases for "+str(stockincrease)+" total units of ingredient "+str(row.ingredientname)+". Inventory not affected. No restock occurred."})
            if (len(restocklist) == 0):
                return jsonify({"message": "No inventory for any ingredients provided is below recommended amount. No query executed."})
                # ingrdientlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount,"location":row.location,"recommendedamount":row.recommendedamount, "caseamount":row.caseamount})
        # return jsonify(ingrdientlist)
        return jsonify(restocklist)
    
    @api.expect(RestockSome_model, validate=True)
    def put(self): #"update" restock some
        """
        PUT method for updating ingredients that need to be restocked from a specified list.
        """
        ingr_list = request.get_json().get("ingredientids", [])
        allingredients = ""
        for id in ingr_list:
            allingredients += "ingredientid = " + str(id) + " or "
        allingredients = allingredients[:-3]
        allingredients += ")"
        # ingredientid = request.get_json().get("ingredientid") 
        with db.engine.connect() as conn:
            get_stmt = "select * from ingredients where count < recommendedamount and ({x}".format(x=allingredients)
            result = conn.execution_options(stream_results=True).execute(text(get_stmt))
            # ingrdientlist = []
            upIng = ''
            logIng = ''
            restocklist = []
            for row in result:
                casestobuy = int((row.recommendedamount - row.count) / row.caseamount) + 1
                stockincrease = casestobuy*row.caseamount
                # restocklist.append({"ingredientid":row.ingredientid, "casesbought":casestobuy,"stockincrease":stockincrease,"message":"Inventory changed. Restock successfull."})
                restocklist.append({"message":"Ordered "+str(casestobuy)+" cases for "+str(stockincrease)+" total units of ingredient "+str(row.ingredientname)+". Inventory changed. Restock successfull."})
                logMessage = 'RESTOCK SOME: BOUGHT {x} CASES OF {y}'.format(x=casestobuy,y=row.ingredientname)
                upIng += "UPDATE Ingredients SET Count = Count + "+ str(stockincrease) + " WHERE IngredientID = " + str(row.ingredientid) + "; "
                logIng += "INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ("+ str(row.ingredientid)+", "+str(+stockincrease)+", '"+logMessage+"', NOW()); "
            
            if (len(restocklist) == 0):
                return jsonify({"message": "No inventory for any ingredients provided is below recommended amount. No query executed."})
            conn.connection.cursor().execute(upIng)
            conn.connection.cursor().execute(logIng)
            conn.connection.commit()
                # ingrdientlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount,"location":row.location,"recommendedamount":row.recommendedamount, "caseamount":row.caseamount})
        # return jsonify(ingrdientlist)
        return jsonify(restocklist)

@api.route('/api/manager/restockbylocation')
class RestockByLocation(Resource):
    """
    Defines API routes for restocking ingredients below the recommended amount in a specified location.
    """
    @api.expect(RestockByLocation_model, validate=True)
    def post(self): #get restock by location
        """
        POST method for retrieving ingredients that need to be restocked from a specified location.
        """
        location = request.get_json().get("location")
        # print("location: "+str(location))
        if ((location != 'fridge') and (location != 'freezer') and (location != 'pantry')):
            return jsonify({"message": "Incorrect or no location entered. No query executed."})
        with db.engine.connect() as conn:
            get_stmt = "select * from ingredients where count < recommendedamount and location = '{x}'".format(x=location)
            result = conn.execution_options(stream_results=True).execute(text(get_stmt))
            restocklist = []
            for row in result:
                casestobuy = int((row.recommendedamount - row.count) / row.caseamount) + 1
                stockincrease = casestobuy*row.caseamount
                # restocklist.append({"ingredientid":row.ingredientid, "casesbought":casestobuy,"stockincrease":stockincrease,"message":"Inventory not affected. No restock occurred."})
                restocklist.append({"message":"Need "+str(casestobuy)+" cases for "+str(stockincrease)+" total units of ingredient "+str(row.ingredientname)+". Inventory not affected. No restock occurred."})
            if (len(restocklist) == 0):
                return jsonify({"message": "No inventory in the location {x} is below recommended amount. No query executed.".format(x=location)})
        return jsonify(restocklist)

    @api.expect(RestockByLocation_model, validate=True)
    def put(self): #"update" restock by location
        """
        PUT method for updating ingredients that need to be restocked from a specified location.
        """
        location = request.get_json().get("location")
        # print("location: "+str(location))
        if ((location != 'fridge') and (location != 'freezer') and (location != 'pantry')):
            return jsonify({"message": "Incorrect or no location entered. No query executed."})
        with db.engine.connect() as conn:
            get_stmt = "select * from ingredients where count < recommendedamount and location = '{x}'".format(x=location)
            result = conn.execution_options(stream_results=True).execute(text(get_stmt))
            # ingrdientlist = []
            upIng = ''
            logIng = ''
            restocklist = []
            for row in result:
                casestobuy = int((row.recommendedamount - row.count) / row.caseamount) + 1
                stockincrease = casestobuy*row.caseamount
                # restocklist.append({"ingredientid":row.ingredientid, "casesbought":casestobuy,"stockincrease":stockincrease,"message":"Inventory changed. Restock successfull."})
                restocklist.append({"message":"Ordered "+str(casestobuy)+" cases for "+str(stockincrease)+" total units of ingredient "+str(row.ingredientname)+". Inventory changed. Restock successfull."})
                logMessage = "RESTOCK FOR {z}: BOUGHT {x} CASES OF {y}".format(z=location,x=casestobuy,y=row.ingredientname)
                upIng += "UPDATE Ingredients SET Count = Count + "+ str(stockincrease) + " WHERE IngredientID = " + str(row.ingredientid) + "; "
                logIng += "INSERT INTO InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) VALUES ("+ str(row.ingredientid)+", "+str(+stockincrease)+", '"+logMessage+"', NOW()); "
            if (len(restocklist) == 0):
                return jsonify({"message": "No inventory in the location {x} is below recommended amount. No query executed.".format(x=location)})
            conn.connection.cursor().execute(upIng)
            conn.connection.cursor().execute(logIng)
            conn.connection.commit()
                # ingrdientlist.append({"ingredientid":row.ingredientid, "ingredientname":row.ingredientname, "ppu":row.ppu,"count":row.count,"minamount":row.minamount,"location":row.location,"recommendedamount":row.recommendedamount, "caseamount":row.caseamount})
        # return jsonify(ingrdientlist)
        return jsonify(restocklist)








'''Manager Reports'''
@api.route('/api/manager/reports/generateproductusage')
class GenerateProductUsage(Resource):
    """
    Defines API routes for generating a product usage report (ingredients' change in inventory amounts over a period of time).
    """
    @api.expect(GenerateProductUsage_model, validate=True)
    def post(self): 
        """
        POST method for retrieving ingredients' change in inventory amounts over a period of time.
        """
        startdate = request.get_json().get("startdate") 
        startdate_str = text(startdate)
        enddate = request.get_json().get("enddate") 
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
    """
    Defines API routes for generating a sales report (menu items' change in sale over a period of time).
    """
    @api.expect(GenerateSalesReport_model, validate=True)
    def post(self): 
        """
        POST method for retrieving menu items' change in sale over a period of time.
        """
        startdate = request.get_json().get("startdate") 
        startdate_str = text(startdate)
        enddate = request.get_json().get("enddate")
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
    """
    Defines API routes for generating an excess report (menu items that have ingredients that have sold less than 10% over a period of time).
    """
    @api.expect(GenerateExcessReport_model, validate=True)
    def post(self): 
        """
        POST method for retrieving menu items that have ingredients that have sold less than 10% over a period of time.
        """
        startdate = request.get_json().get("startdate") 
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
    """
    Defines API routes for generating a restock report (ingredients that have less than the their minimum amount).
    """
    def get(self): 
        """
        GET method for retrieving ingredients that have less than the their minimum amount.
        """
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
    """
    Defines API routes for generating an order trend report (top ten menu items ordered together).
    """
    @api.expect(GenerateOrderTrend_model, validate=True)
    def post(self): 
        """
        POST method for retrieving the top ten menu items ordered together.
        """
        startdate = request.get_json().get("startdate") 
        startdate_str = text(startdate)
        enddate = request.get_json().get("enddate") 
        enddate_str = text(enddate)
        order_trend_query = "SELECT DISTINCT MID1, MID2, Count (*) AS count FROM (SELECT n1.itemname AS MID1, n2.itemname AS MID2, t1.OrderID FROM OrderMenuItems t1 JOIN OrderMenuItems t2 ON t1.OrderID = t2.OrderID AND t1.menuID <  t2.MenuID JOIN Orders ON Orders.OrderID = t1.OrderID Join MenuItems n1 ON t1.MenuID = n1.MenuID JOIN MenuItems n2 on n2.MenuID = t2.MenuID WHERE Orders.OrderDateTime BETWEEN CAST('{inputstart}' AS DATE) AND CAST('{inputend}' AS DATE)) AS doubleJoin  GROUP BY MID1, MID2 ORDER BY count DESC LIMIT 10".format(inputstart = startdate_str, inputend = enddate_str)
        with db.engine.connect() as conn:
            result = conn.execution_options(stream_results=True).execute(text(order_trend_query))
            menuitemlist = []
            for row in result:
                menuitemlist.append({"menuid1":row.mid1, "menuid2":row.mid2, "count":row.count})
        return jsonify(menuitemlist)
    




def init():
    """
    Initialization function.
    """
    return 