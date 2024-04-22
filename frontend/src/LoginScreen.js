import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './LoginScreen.css'
import { useNavigate  } from 'react-router-dom';

function LoginScreen(){
    const { user, setUser, authority, setAuthority, loggedIn, setLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("User state changed:", user);

    }, [user]);

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
    
    const login = useGoogleLogin({
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
                setUser(res.data);
                const authority = getAuthority(res.data);
                setAuthority(authority);
                setLoggedIn(true);
                localStorage.setItem('isLoggedIn', true);
                console.log("Now logged in:", res.data);
            } catch (err) {
                console.log(err);
            }
        },
    });

    if (loggedIn){
        if (authority >= 3){
            console.log("Manager logged in");
            navigate('/manager');
        } else if (authority >= 2){
            console.log("Employee logged in");
            navigate('/employee');
        } else {
            console.log("Rando logged in");
            navigate('/customer');
        }
    }else{
        return (
            <div class="LoginScreen">
                <div class="LoginTitle">
                    Rev's Grill - By Team 21
                </div>
                <div class="LoginButton">
                    <button onClick={() => login()}>
                        Sign In
                    </button>
                </div>
            </div> 
        );
    }
}

export default LoginScreen;