import React, { createContext, useState } from 'react';

/**
 * Context for managing user data.
 * @type {React.Context}
 */
export const UserContext = createContext();

/**
 * Provider component for UserContext.
 * @param {object} children - The children components to be wrapped by the provider.
 */
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
