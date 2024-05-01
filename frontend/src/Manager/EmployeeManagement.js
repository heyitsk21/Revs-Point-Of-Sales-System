import React, { useState, useEffect } from 'react';
import './Inventory.css';
import './../Common.css';
import { useTextSize } from '../components/TextSizeContext.js';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar.js';
import Restock from './Restock.js';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        employeeid: 0,
        employeename: "",
        email: "",
        ismanager: "False",
        salary: 0.0,
        password: "",
    });
    const [speakEnabled] = useState(false);
    const { textSize } = useTextSize();

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/employee');
            setEmployees(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching Employees:', error);
        }
    };

    const handleItemSelected = (item) => {
        setSelectedEmployee(item);
    };

    const handleItemUpdate = async () => {
        try {
            const payload = {
                employeeid: parseInt(selectedEmployee.employeeid),
                employeename: selectedEmployee.employeename,
                email: selectedEmployee.email,
                ismanager: selectedEmployee.ismanager,
                salary: parseFloat(selectedEmployee.salary),
                password: selectedEmployee.password,
            };
    
            await axios.put('https://team21revsbackend.onrender.com/api/manager/ingredients', payload);
            alert('Ingredient edited successfully:');
            fetchEmployees();
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };

    const handleIngredientSubmit = async () => { //TODO
        try {
            const newEmployeeData = {
                ...newEmployee,
                count: parseInt(newEmployee.count),
                ppu: parseFloat(newEmployee.ppu),
                minamount: parseFloat(newEmployee.minamount),
                recommendedamount: parseInt(newEmployee.recommendedamount),
                caseamount: parseInt(newEmployee.caseamount)
            };
    
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/ingredients', newEmployeeData);
            alert('Ingredient added successfully:');
            fetchEmployees();
            setNewEmployee({
                ingredientid: 0,
                ingredientname: "",
                count: 0,
                ppu: 0,
                minamount: 0,
                location: "",
                recommendedamount: 0,
                caseamount: 0
            });
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    const handleIngredientDelete = async (itemId, deleteCount) => {
        if (window.confirm("Are you sure you want to delete this ingredient?")) {
            try {
                const response = await axios.delete('https://team21revsbackend.onrender.com/api/manager/ingredients', { data: { ingredientid: itemId, count: deleteCount } });
                alert('Item deleted successfully:');
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSelectedEmployee(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleMouseOver = debounce((event) => {
        let hoveredElementText = '';
        if (speakEnabled) {
            if (event.target.innerText) {
                hoveredElementText = event.target.innerText;
            } else if (event.target.value) {
                hoveredElementText = event.target.value;
            } else if (event.target.getAttribute('aria-label')) {
                hoveredElementText = event.target.getAttribute('aria-label');
            } else if (event.target.getAttribute('aria-labelledby')) {
                const id = event.target.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(id);
                if (labelElement) {
                    hoveredElementText = labelElement.innerText;
                }
            }
            speakText(hoveredElementText);
        }
    }, 1000);

    const renderInventoryItems = () => {
        return employees.map(employee => (
            <div key={employee.ingredientid} className="inventory-item" onClick={() => handleItemSelected(employee)}>
                <div className='ingredient-name'><span>{employee.employeename}</span></div>
                <span>Employee Email: {employee.email}</span>
                <span>Manager: { employee.ismanager ? 'Yes' : 'No' }</span>
                <span>Salary: ${employee.salary}</span>
                <span>Password: {employee.password}</span>
            </div>
        ));
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div>
            <ManagerTopBar />
            <div className={`manager-inventory ${textSize === 'large' ? 'large-text' : ''}`}>
                <div className="inventory-details">
                    <h2>Selected Employee Details</h2>
                    {selectedEmployee && (
                        <div className="selected-item">
                            <h3>{selectedEmployee.ingredientname}</h3>
                            <div>
                                <label>Employee ID:</label>
                                <input
                                    type="text"
                                    value={selectedEmployee.employeeid}
                                    onChange={(e) => handleInputChange(e, 'employeeid')}
                                />
                            </div>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={selectedEmployee.employeename}
                                    onChange={(e) => handleInputChange(e, 'employeename')}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    value={selectedEmployee.email}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                />
                            </div>
                            <div>
                                <label>Manager:</label>
                                <input
                                    type="text"
                                    value={selectedEmployee.ismanager}
                                    onChange={(e) => handleInputChange(e, 'ismanager')}
                                />
                            </div>
                            <div>
                                <label>Salary:</label>
                                <input
                                    type="number"
                                    value={selectedEmployee.salary}
                                    onChange={(e) => handleInputChange(e, 'salary')}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="text"
                                    value={selectedEmployee.password}
                                    onChange={(e) => handleInputChange(e, 'password')}
                                />
                            </div>
                            <button className='ingredient-button' onClick={handleItemUpdate}>Submit</button>
                            <button className='ingredient-button' onClick={() => handleIngredientDelete(selectedEmployee.employeeid)}>Delete</button>
                        </div>
                    )}
                </div>
                <div className="new-ingredient">
                    <h2>Add New Employee</h2>
                    <div className='new-ingredient-user'>
                        <label>Employee ID:</label>
                        <input
                            type="number"
                            value={newEmployee.employeeid}
                            onChange={(e) => setNewEmployee({ ...newEmployee, employeeid: e.target.value })}
                        />
                    </div>
                    <div className='new-ingredient-user'>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={newEmployee.employeename}
                            onChange={(e) => setNewEmployee({ ...newEmployee, employeename: e.target.value })}
                        />
                    </div>
                    <div className='new-ingredient-user'>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        />
                    </div>
                    <div className='new-ingredient-user'>
                        <label>Manager:</label>
                        <input
                            type="text"
                            value={newEmployee.ismanager}
                            onChange={(e) => setNewEmployee({ ...newEmployee, ismanager: e.target.value })}
                        />
                    </div>
                    <div className='new-ingredient-user'>
                        <label>Salary:</label>
                        <input
                            type="number"
                            value={newEmployee.salary}
                            onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                        />
                    </div>
                    <div className='new-ingredient-user'>
                        <label>Password:</label>
                        <input
                            type="number"
                            value={newEmployee.password}
                            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                        />
                    </div>
                    <button className='ingredient-button' onClick={handleIngredientSubmit}>Submit</button>
                </div>

                <div className="inventory-list">
                    <h2>Employees</h2>
                    {renderInventoryItems()}
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;
