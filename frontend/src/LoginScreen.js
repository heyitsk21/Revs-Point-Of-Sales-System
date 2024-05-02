/**
 * Component for the login screen of the application.
 * Handles user authentication via email/password and Google OAuth.
 * Redirects users based on their authority level.
 * @returns {JSX.Element} The JSX element representing the login screen.
 */
import React, { useEffect, useState, useContext } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './LoginScreen.css'
import { useNavigate  } from 'react-router-dom';

function LoginScreen(){
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    /**
     * Fetches the list of employees from the backend upon component mount.
     */
    useEffect(() => {
        fetchEmployees();
    }, []);

    /**
     * Fetches the list of employees from the backend.
     */
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/employee');
            setEmployees(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    /**
     * Determines the authority level of the user based on the provided user data.
     * @param {Object} userData - The user data received from the Google OAuth.
     * @returns {number} The authority level of the user.
     */
    const getAuthority = (email) => {
        const employee = employees.find(emp => emp.employeeemail === email);
        console.log("authority: ", employee);
        if (employee) {
            localStorage.setItem('userID', employee.employeeid);
            console.log(localStorage.getItem('userID'));
            return employee.ismanager ? 3 : 2;
        } else {
            return 1;
        }
    };

    const checkPassword = (email, userPassword) => {
        const employee = employees.find(emp => emp.employeeemail === email);
        console.log("authority: ", employee);
        if (employee){
            if (employee.password === userPassword){
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    };

    /**
     * Redirects the user to the appropriate page based on their authority level.
     */
    const redirect = () => {
        if (localStorage.getItem('authority') >= 3){
            console.log("Manager logged in");
            navigate('/manager');
        } else if (localStorage.getItem('authority') >= 2){
            console.log("Employee logged in");
            navigate('/employee');
        } else if (localStorage.getItem('authority') >= 1){
            console.log("Rando logged in");
            navigate('/customer');
        }
    };

    /**
     * Handles the Google OAuth login process.
     */
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );
                const authority = getAuthority(res.data.email);
                console.log(res.data);
                localStorage.setItem('authority', authority);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userInfo', res.data);
                localStorage.setItem('username', res.data.given_name);
                console.log("Now logged in:", res.data);
                setTimeout(redirect, 200);
            } catch (err) {
                console.log(err);
            }
        },
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Updates the email state based on user input.
     * @param {Object} event - The input change event.
     */
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    /**
     * Updates the password state based on user input.
     * @param {Object} event - The input change event.
     */
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    
    /**
     * Handles the form submission when using email/password authentication.
     * @param {Object} event - The form submission event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Email: ${email}, Password: ${password}`);
        // login logic
        if (checkPassword(email, password)){
            localStorage.setItem('username', email);
            const authority = getAuthority(email);
            localStorage.setItem('authority', authority);
            localStorage.setItem('isLoggedIn', true);
            console.log("Now logged in");
            setTimeout(redirect, 200);
        }
    };

    return (
        <div className="LoginScreen">
            <div className="LoginTitle">
                Rev's Grill - By Team 21
            </div>
            <form onSubmit={handleSubmit}>
                <div className="userinput">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                </div>
                <div className="userinput">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                </div>
                <div className="loginButton">
                    <button type="submit">Sign in</button>
                </div>
            </form>
            
            <div className="googleLoginButton">
                <button onClick={() => googleLogin()}>
                    Sign in with Google
                </button>
            </div>
        </div> 
    );
}

export default LoginScreen;
