import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import apiClient from "../api/axios";


interface User {
    email: string;
    id: string;
    roles: string[];
}


interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void; 
    logout: () => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<User>('/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    // The implementation now matches the type: it takes no arguments
    const login = () => {
        // The role of this function is to trigger a state update after
        // the browser has received the HttpOnly cookie.
        checkAuthStatus();
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
            // Even if logout fails on the server, clear the state on the client
            setUser(null);
        }
    };
    
    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};