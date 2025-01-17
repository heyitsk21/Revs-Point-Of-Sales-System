/**
 * Employee Management Component.
 * @module EmployeeManagement
 * @component
 * @example
 * return <EmployeeManagement />
 */
import React, { useState, useEffect } from 'react';
import './EmployeeManagement.css';
import './../Common.css';
import { useTextSize } from '../components/TextSizeContext.js';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar.js';

/**
 * Employee Management functional component.
 * @returns {JSX.Element} EmployeeManagement component
 */
function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState({
        employeeid: 0,
        employeename: "",
        employeeemail: "",
        ismanager: "",
        salary: 0.0,
        password: "",
    });
    const [newEmployee, setNewEmployee] = useState({
        employeeid: 0,
        employeename: "",
        employeeemail: "",
        ismanager: "",
        salary: 0.0,
        password: "",
    });
    const [speakEnabled] = useState(false);
    const { textSize } = useTextSize();
    const [highContrast, setHighContrast] = useState(false);

    /**
     * Fetches the list of employees from the API.
     */
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/employee');
            setEmployees(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching Employees:', error);
        }
    };

    /**
     * Sets the selected employee.
     * @param {Object} item - The selected employee object
     */
    const handleEmployeeSelected = (item) => {
        setSelectedEmployee(item);
    };

    /**
     * Updates the selected employee's details.
     */
    const handleEmployeeUpdate = async () => {
        try {
            let tempIsManager = false;
            if (selectedEmployee.ismanager === "True"){
                tempIsManager = true;
            }
            
            const payload = {
                employeeid: selectedEmployee.employeeid,
                employeeName: selectedEmployee.employeename,
                employeeEmail: selectedEmployee.employeeemail,
                isManager: tempIsManager,
                salary: parseFloat(selectedEmployee.salary),
                password: selectedEmployee.password,
            };
    
            await axios.put('https://team21revsbackend.onrender.com/api/manager/employee', payload);
            alert('Employee edited successfully:');
            fetchEmployees();
        } catch (error) {
            console.error('Error updating Employee:', error);
        }
    };

    /**
     * Submits a new employee to be added.
     */
    const handleEmployeeSubmit = async () => { //TODO
        try {
            let tempIsManager = false;
            if (newEmployee.ismanager === "True"){
                tempIsManager = true;
            }

            const newEmployeeData = {
                ...newEmployee,
                employeeName: newEmployee.employeename,
                employeeEmail: newEmployee.employeeemail,
                isManager: tempIsManager,
                salary: parseFloat(newEmployee.salary),
                password: newEmployee.password,
            };
    
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/employee', newEmployeeData);
            alert('Employee added successfully:');
            fetchEmployees();
            setNewEmployee({
                employeeid: 0,
                employeename: "",
                employeeemail: "",
                ismanager: "False",
                salary: 0.0,
                password: "",
            });
        } catch (error) {
            console.error('Error adding Employee:', error);
        }
    };

    /**
     * Deletes the selected employee.
     * @param {number} deleteID - The ID of the employee to be deleted
     */
    const handleEmployeeDelete = async (deleteID) => {
        if (window.confirm("Are you sure you want to delete this Employee?")) {
            try {
                const response = await axios.delete('https://team21revsbackend.onrender.com/api/manager/employee', { data: { employeeid: deleteID } });
                alert('Item deleted successfully:');
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    /**
     * Handles input change for the selected employee.
     * @param {Object} e - The event object
     * @param {string} field - The field to update
     */
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSelectedEmployee(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    /**
     * Toggles the high contrast mode.
     */
    const toggleHighContrast = () => {
        setHighContrast(prevState => !prevState);
    };

    /**
     * Renders the list of employees.
     * @returns {JSX.Element[]} List of employee elements
     */
    const renderEmployeeItems = () => {
        return employees.map(employee => (
            <div key={employee.employeeid} className="employee-item" onClick={() => handleEmployeeSelected(employee)}>
                <div className='employee-name'><span>{employee.employeename}</span></div>
                <span>Employee Email: {employee.employeeemail}</span>
                <span>Manager: { employee.ismanager ? 'Yes' : 'No' }</span>
                <span>Salary: ${employee.salary}</span>
                <span>Password: {employee.password}</span>
            </div>
        ));
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Function to handle change in dropdown selection for selectedEmployee
    const handleSelectDropdown = (event) => {
        setSelectedEmployee(prevState => ({
            ...prevState,
            ismanager: event.target.value // Update selected option state
        }));
    };

    // Function to handle change in dropdown selection for newEmployee
    const handleNewDropdown = (event) => {
        setNewEmployee(prevState => ({
            ...prevState,
            ismanager: event.target.value // Update selected option state
        }));
    };


    return (
        <div className={`employeemanager-topbar ${textSize === 'large' ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
            <ManagerTopBar toggleHighContrast={toggleHighContrast} />
            <div className={`manager-employee ${textSize === 'large' ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
                <div className="employee-details">
                    <h2>Selected Employee Details</h2>
                    {selectedEmployee && (
                        <div className="selected-employee">
                            <h3>{selectedEmployee.employeename}</h3>
                            <div>
                                <label>Employee ID: {selectedEmployee.employeeid}</label>
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
                                    value={selectedEmployee.employeeemail}
                                    onChange={(e) => handleInputChange(e, 'employeeemail')}
                                />
                            </div>
                            <div>
                                <label>Manager:</label>
                                <select id="dropdown" value={selectedEmployee.ismanager} onChange={handleSelectDropdown}>
                                    <option value="">Select...</option>
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                </select>
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
                            <button onClick={handleEmployeeUpdate}>Submit</button>
                            <button onClick={() => handleEmployeeDelete(selectedEmployee.employeeid)}>Delete</button>
                        </div>
                    )}
                </div>
                <div className="new-employee">
                    <h2>Add New Employee</h2>
                    <div className='new-employee-user'>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={newEmployee.employeename}
                            onChange={(e) => setNewEmployee({ ...newEmployee, employeename: e.target.value })}
                        />
                    </div>
                    <div className='new-employee-user'>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={newEmployee.employeeemail}
                            onChange={(e) => setNewEmployee({ ...newEmployee, employeeemail: e.target.value })}
                        />
                    </div>
                    <div className='new-employee-user'>
                        <label>Manager:</label>
                        <select id="dropdown" value={newEmployee.ismanager} onChange={handleNewDropdown}>
                            <option value="">Select...</option>
                            <option value="True">True</option>
                            <option value="False">False</option>
                        </select>
                    </div>
                    <div className='new-employee-user'>
                        <label>Salary:</label>
                        <input
                            type="number"
                            value={newEmployee.salary}
                            onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                        />
                    </div>
                    <div className='new-employee-user'>
                        <label>Password:</label>
                        <input
                            type="text"
                            value={newEmployee.password}
                            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                        />
                    </div>
                    <button onClick={handleEmployeeSubmit}>Submit</button>
                </div>

                <div className="employee-list">
                    <h2>Employees</h2>
                    {renderEmployeeItems()}
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;
