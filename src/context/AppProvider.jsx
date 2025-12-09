import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function useAppContext() {
    const context = useContext(AppContext);
    
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider. Check your main.jsx structure.');
    }
    
    return context;
}

export function AppProvider({ children }) {
    const navigate = useNavigate();

    const value = {
        navigate,
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}