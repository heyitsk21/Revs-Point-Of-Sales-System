import React, { useEffect, useContext } from 'react';
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
                setAuthority(2);
                setLoggedIn(true);
                localStorage.setItem('isLoggedIn', true);
                console.log("Now logged in:", user);
            } catch (err) {
                console.log(err);
            }
        },
    });

    if (loggedIn){
        if (authority >= 3){
            navigate('/manager');
        } else if (authority >= 2){
            console.log("Employee would be here");
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