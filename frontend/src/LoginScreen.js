import React, { useEffect, useState, useContext } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './LoginScreen.css'
import { useNavigate  } from 'react-router-dom';

function LoginScreen(){
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/employee');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const getAuthority = (userData) => {
        const employee = employees.find(emp => emp.employeename === userData.email);
        console.log("authority: ", employee);
        if (employee) {
            return employee.ismanager ? 3 : 2;
        } else {
            return 1;
        }
    };

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
                const authority = getAuthority(res.data);
                localStorage.setItem('authority', authority);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userInfo', res.data);
                localStorage.setItem('username', res.data.given_name)
                console.log("Now logged in:", res.data);
                setTimeout(redirect, 200);
            } catch (err) {
                console.log(err);
            }
        },
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Email: ${email}, Password: ${password}`);
        // login logic
        localStorage.setItem('username', email)
        localStorage.setItem('authority', 1);
        localStorage.setItem('isLoggedIn', true);
        console.log("Now logged in");
        setTimeout(redirect, 200);
    };

    return (
        <div class="LoginScreen">
            <div class="LoginTitle">
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
                
            </form>
            <div class="loginButton">
                <button type="submit">Sign in</button>
            </div>
            <div class="googleLoginButton">
                <button onClick={() => googleLogin()}>
                    Sign in with Google
                </button>
            </div>
        </div> 
    );
}

export default LoginScreen;