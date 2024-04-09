import React, { useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './LoginScreen.css'
import App from './App'

function LoginScreen(){
    const { user, setUser, authority, setAuthority, loggedIn, setLoggedIn } = useContext(UserContext);

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
                setAuthority(3);
                setLoggedIn(true);
            } catch (err) {
                console.log(err);
            }
        },
    });

    if (loggedIn){
        if (authority >= 3){
            return <App />;
        } else if (authority >= 2){
            console.log("Employee would be here");
        } else {
            console.log("Rando logged in");
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