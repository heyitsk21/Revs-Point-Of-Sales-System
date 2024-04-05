import logo from './logo.csv'
import { useEffect , useState } from 'react';
import jwt_decode from "jwt-decode";
import './Login.css'

function Login(){
    const [ user, setUser ] = useState({});

    function handleCallBackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
        setUser(userObject);
        document.getElementById("signInDiv").hidden = true;
    }

    function handleSignOut(event) {
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "733292463164-aaka96c72dunj93ihdcdjvojahrigloh.apps.googleusercontent.com",
            callback: handleCallBackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        );

        google.accounts.id.prompt();
    }, []);
    // if no user show sign in
    // if user show logout
    return (
        <div className='App'>
            <div id="signInDiv">
            { Object.keys(user).length != 0 && 
                <button onClick={ (e) => handleSignOut(e)}>Sign Out</button>
            }
            { user &&
                <div>
                    <img src={user.picture}></img>
                    <h3>{user.name}</h3>
                </div>
            }
            </div>
        </div>
    );
}