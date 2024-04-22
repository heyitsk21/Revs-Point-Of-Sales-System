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
                const authority = getAuthority(res.data);
                localStorage.setItem('authority', authority);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userInfo', res.data);
                localStorage.setItem('username', res.data.given_name)
                console.log("Now logged in:", res.data);
                setTimeout(redirect, 100);
            } catch (err) {
                console.log(err);
            }
        },
    });

    if (localStorage.getItem('isLoggedIn' == true)){
        redirect();
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