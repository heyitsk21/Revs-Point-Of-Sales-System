DROP TABLE IF EXISTS Employee CASCADE;
DROP TABLE IF EXISTS Ingredients CASCADE;
DROP TABLE IF EXISTS MenuItems CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS InventoryLog CASCADE;
DROP TABLE IF EXISTS MenuItemIngredients CASCADE;
DROP TABLE IF EXISTS OrderMenuItems CASCADE;
DROP TABLE IF EXISTS MenuItemCustomizations CASCADE;
DROP TABLE IF EXISTS CustomizationOrderMenu CASCADE;



CREATE TYPE ORDERSTATUS AS ENUM ('completed','inprogress','deleted','canceled');
CREATE TYPE KITCHENLOCATIONS AS ENUM ('freezer','fridge','pantry');

--CREATE TABLES AND JUNCTIONTABLE BELOW
-- Create Ingredients table
CREATE TABLE Ingredients (
    IngredientID SERIAL PRIMARY KEY,
    IngredientName VARCHAR(100),
    PPU NUMERIC(10, 2), -- I used NUMERIC (10,2) because it cuts us off to 2 decimal places for money
    Count INT,
    MinAmount INT,
    Location KITCHENLOCATIONS,
    RecommendedAmount INT,
    CaseAmount INT
);

-- Create MenuItems table
CREATE TABLE MenuItems (
    MenuID SERIAL PRIMARY KEY,
    ItemName VARCHAR(100),
    Price NUMERIC(10, 2),
    PicturePath VARCHAR(200)
);

-- Create Employee table
CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    EmployeeName VARCHAR(100),
    IsManager BOOLEAN,
    Salary NUMERIC(10, 2), 
    Password VARCHAR(100)
);

-- Create Order table
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    CustomerName VARCHAR(100),
    TaxPrice NUMERIC(10, 2), 
    BasePrice NUMERIC(10, 2), 
    OrderDateTime TIMESTAMP,
    EmployeeID INT, 
    orderstat ORDERSTATUS,
    CONSTRAINT fk_employee
        FOREIGN KEY(EmployeeID) 
        REFERENCES Employee(EmployeeID)

);

-- Create InventoryLog table
CREATE TABLE InventoryLog (
    LogID SERIAL PRIMARY KEY,
    IngredientID INT,
    AmountChanged NUMERIC(10, 2), 
    LogMessage TEXT,
    LogDateTime TIMESTAMP
);

-- Create MenuItemIngredients junction table
CREATE TABLE MenuItemIngredients (
    MenuID INT ,
    IngredientID INT,
    PRIMARY KEY (MenuID, IngredientID),
    CONSTRAINT fk_ingredient
        FOREIGN KEY(IngredientID) 
        REFERENCES Ingredients(IngredientID),
    CONSTRAINT fk_menu
        FOREIGN KEY(MenuID) 
        REFERENCES MenuItems(MenuID)
);

-- Create MenuItemCustomizations junction table
CREATE TABLE MenuItemCustomizations (
    MenuID INT ,
    CustomizationID INT,
    PRIMARY KEY (MenuID, CustomizationID),
    CONSTRAINT fk_ingredient
        FOREIGN KEY(CustomizationID) 
        REFERENCES Ingredients(IngredientID),
    CONSTRAINT fk_menu
        FOREIGN KEY(MenuID) 
        REFERENCES MenuItems(MenuID)
);

-- Create OrderMenuItems junction table
CREATE TABLE OrderMenuItems (
    JoinID SERIAL,
    OrderID INT,
    MenuID INT,
    CustomizationID INT,
    PRIMARY KEY (JoinID),
    CONSTRAINT fk_menu
        FOREIGN KEY(MenuID) 
        REFERENCES MenuItems(MenuID),
    CONSTRAINT fk_order
        FOREIGN KEY(OrderID) 
        REFERENCES Orders(OrderID)   
        ON DELETE CASCADE
);

CREATE TABLE CustomizationOrderMenu (
    CustomizationOrderMenuID INT,
    IngredientID INT,
    PRIMARY KEY (CustomizationOrderMenuID, IngredientID),
    CONSTRAINT fk_ingredient
        FOREIGN KEY(IngredientID) 
        REFERENCES Ingredients(IngredientID)
);


--COPY CHUNKS BELOW
-- Copy data from CSV files into their corresponding tables

\COPY Ingredients (IngredientName, PPU, Count, MinAmount, Location, RecommendedAmount, CaseAmount) FROM 'database_generation/Ingredients.csv' DELIMITER ',' CSV HEADER;

\COPY MenuItems (MenuID, ItemName, Price, PicturePath) FROM 'database_generation/MenuItems.csv' DELIMITER ',' CSV HEADER;

\COPY MenuItemIngredients (MenuID, IngredientID) FROM 'database_generation/MenuItemsIngredients.csv' DELIMITER ',' CSV HEADER;

\COPY MenuItemCustomizations (MenuID, CustomizationID) FROM 'database_generation/MenuItemCustomizations.csv' DELIMITER ',' CSV HEADER;

\COPY Employee (EmployeeID, EmployeeName, IsManager, Salary, Password) FROM 'database_generation/Employee.csv' DELIMITER ',' CSV HEADER;

\COPY Orders (CustomerName, TaxPrice, BasePrice, OrderDateTime, EmployeeID) FROM 'database_generation/Orders.csv' DELIMITER ',' CSV HEADER;

\COPY InventoryLog (IngredientID, AmountChanged, LogMessage, LogDateTime) FROM 'database_generation/InventoryLog.csv' DELIMITER ',' CSV HEADER;

\COPY OrderMenuItems  (OrderID, MenuID,CustomizationID) FROM 'database_generation/JunctionOrdersMenu.csv' DELIMITER ',' CSV HEADER;

\COPY CustomizationOrderMenu (CustomizationOrderMenuID,IngredientID ) FROM 'database_generation/CustomizationOrderMenuID_Ingredients.csv' DELIMITER ',' CSV HEADER;


UPDATE orders SET orderstat = 'completed';


--for testing purposes order 10 is in progress
UPDATE orders SET orderstat = 'inprogress' where ORDERID = 10;

-- For demo, Josephs path: \i C:/Users/jnucc/Desktop/CSCE/project-3-full-stack-agile-web-team-21/backend/database_generation/regenerate.sql