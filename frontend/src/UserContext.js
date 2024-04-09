import React, { createContext, useState } from 'react';

// Create context
export const UserContext = createContext();

// Create provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [authority, setAuthority] = useState({});
    const [loggedIn, setLoggedIn] = useState(false); 

    return (
        <UserContext.Provider value={{ user, setUser, authority, setAuthority, loggedIn, setLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};
