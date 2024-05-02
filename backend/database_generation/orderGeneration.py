import random
from datetime import datetime,date,time,timedelta

EMPLOYEEIDPOOL = [1, 2, 3, 4, 5, 6]

MENUITEMSPOOL = {
101 : 8.29,
102	: 8.38,
103 : 6.89,
104	: 7.59,
105 : 6.89,
201	: 8.39,
202	: 8.39,
203	: 8.39,
301	: 8.99,
401	: 4.49,
402	: 4.49,
403	: 4.49,
404	: 4.49,
405	: 4.69,
406	: 4.69,
407	: 5.49,
501	: 1.99,
502	: 1.79,
503	: 2.19,
504	: 1.99,
601	: 4.99,
602	: 4.99,
603	: 4.99,
701	: 6.00,
702	: 7.99,
703 : 7.99,
704 : 7.99}

MENUITEMINGREDIENTPOOL = {
101 : (1, 2, 6, 14, 33),
101 : (6, 13, 14, 33),
103 : (2, 6, 13, 14, 33, 46),
104 : (6),
105 : (6, 13, 14, 33),
201 : (1),
202 : (6, 13),
203 : (13),
701 : (13),
703 : (2, 60),
704 : (13, 14, 60)
}

class OrderGenerator:
    """
    Class to generate orders with customization for a restaurant.

    Attributes:
    - f1: File pointer for Orders.csv.
    - f2: File pointer for JunctionOrdersMenu.csv.
    - f3: File pointer for InventoryLog.csv.
    - f4: File pointer for CustomizationOrderMenuID_Ingredients.csv.
    """

    f1 = None
    f2 = None
    f3 = None
    f4 = None

    def CreateOrder(self, date, ID, LogId, CustomizationOrderMenuID):
        """
        Creates an order with customization.

        Parameters:
        - date (datetime.date): Date of the order.
        - ID (int): ID of the order.
        - LogId (int): ID for logging.
        - CustomizationOrderMenuID (list): List containing the customization order menu ID.

        Returns:
        - LogId (int): Updated log ID.
        """
        name = random.choice(self.NAMEPOOL)
        #Pick a random name with equal weight to all choices

        empID = EMPLOYEEIDPOOL[random.randrange(0, len(EMPLOYEEIDPOOL))]
        #Pick a random employee ID with equal weight to all choices

        #Pick from the MENUITEMS POOL a menu item(s)
        numberOfMenuItems = random.choices([1,2,3,4,5,6,7,8,9,10,50],[4000,5000,4300,200,100,100,100,100,100,100,1],k=1)[0]
        
        totalPrice = 0
        
        for i in range(numberOfMenuItems):
            item = random.choices(list(range(25)),
                [4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1])[0] 
            # print("item: "+ str(item))
            itemID = list(MENUITEMSPOOL.keys())[item]
            # print("itemid: "+str(itemID))
            totalPrice += MENUITEMSPOOL[itemID]
            self.f2.write(str(ID) + ',' + str(itemID) + ',' + str(CustomizationOrderMenuID[0]) + '\n') #OrderID,MenuID,CustomizationOrderMenuID
            
            if itemID in MENUITEMINGREDIENTPOOL: #if the item can possibly have a customization
                cust_list = MENUITEMINGREDIENTPOOL[itemID] #get the tuple from the pool of the customizable ingredients
                # print("cust_list: "+str(cust_list))
                try:
                    cust_len = len(cust_list) 
                    # print("cust_len: "+str(cust_len))
                    cust_num_select = random.randint(0,cust_len)
                    # print("cust_num_select: "+str(cust_num_select))
                    for i in range(cust_num_select):
                        self.f4.write(str(CustomizationOrderMenuID[0]) + ',' + str(cust_list[i]) + '\n') #CustomizationOrderMenuID,IngredientID
                except:
                    cust_num_select = random.randint(0,1)
                    # print("cust_num_select: "+str(cust_num_select))
                    for i in range(cust_num_select):
                        self.f4.write(str(CustomizationOrderMenuID[0]) + ',' + str(cust_list) + '\n') #CustomizationOrderMenuID,IngredientID
            
            CustomizationOrderMenuID[0] += 1
            #insert into sql junction table


            # customization = random.choices(list(range(12)))[0]
            # customization = random.choices([5,4,6,1,4,1,2,1,1,1,2,3])
            # print(customization)
            # customizationid = list(MENUITEMINGREDIENTPOOL.keys())[customization]
            # print(customizationid)
            # cust_len = len(MENUITEMINGREDIENTPOOL[customizationid])
            # print(cust_len)

        

        #Calcuate Tax with function below
        tax = self.CalculateTax(totalPrice)

        #Generate time can be equal weight or proritize rush traffic but must be during hours that revs is open
        dayOfTheWeek = date.weekday()
        if (dayOfTheWeek >= 0 and dayOfTheWeek <=3): #Mondays - Thursdays
            openHours = list(range(10, 22))          #open from 10am - 9pm
            openWeights = [1,4,4,2,1,1,1,3,4,5,3,1]
        elif (dayOfTheWeek == 4):                    #Fridays
            openHours = list(range(10, 21))          #open from 10am - 8pm
            openWeights = [1,4,4,2,1,1,1,3,4,3,1] 
        else:                                        #Saturdays - Sundays
            openHours = list(range(11, 21))          #open from 11am - 8pm
            openWeights = [1,2,4,2,1,1,1,3,3,2] 

        t = time(hour = random.choices(openHours, openWeights, k=1)[0], minute = random.randrange(0, 59), second = random.randrange(0, 59))
        #is an object of the time class https://docs.python.org/3/library/datetime.html#time-objects    
        dt= datetime.combine(date, t)
        self.f1.write(name + ',' + str(tax) + ','+ str(totalPrice) +',' + str(dt) + ',' + str(empID)+'\n')
        for i in range(random.randrange(2,5)):
            self.f3.write(str(random.randrange(1,63)) + ',' + str(random.randrange(-5,-1)) + ', Place by Order: ' + str(ID) + ',' + str(dt) + '\n' )
            LogId += 1
            #insert into junction table between order and menu items 
        return LogId + 1

    def CalculateTax(self, price):
        price *= 0.0825
        return price
    
    def __init__(self):
        """
        Initializes the OrderGenerator object and opens necessary files.
        """ 
        with open("names.txt", "r") as file:
            self.NAMEPOOL = [name.strip() for name in file.readlines()]
        self.f1 = open("Orders.csv","w")
        self.f2 = open("JunctionOrdersMenu.csv","w")
        self.f3 = open("InventoryLog.csv", "w")
        self.f4 = open("CustomizationOrderMenuID_Ingredients.csv", "w")
        
        self.f1.write("CustomerName,TaxPrice,BasePrice,OrderDateTime,EmployeeID\n")
        self.f2.write("OrderID,MenuID,CustomizationOrderMenuID\n")
        self.f3.write("IngredientID,AmountChanged,LogMessage,LogDateTime\n")
        self.f4.write("CustomizationOrderMenuID,IngredientID\n")

    def __del__(self):
        self.f1.close()
        self.f2.close()
        self.f3.close()
        self.f4.close()




def Main():
    og = OrderGenerator()
    day = date.fromisoformat('2023-02-19')
    delta = timedelta(days = 1)
    ID = 1
    LogId = 0
    CustomizationOrderMenuID = [1]
    for i in range(0,500):
        # generate a random number of requests per day
        orderMod = random.randrange(0,100)
        for j in range(0,500 + orderMod):
            LogId = og.CreateOrder(day,ID,LogId,CustomizationOrderMenuID)
            ID += 1
            # CustomizationOrderMenuID += 1
        if(day == date.fromisoformat('2024-01-19') or day == date.fromisoformat('2023-08-19')):
            for j in range(0,5500):
                LogId  = og.CreateOrder(day,ID, LogId, CustomizationOrderMenuID)
                ID += 1
        day += delta
        
        print(day)
    return

if __name__ == "__main__":
    Main()