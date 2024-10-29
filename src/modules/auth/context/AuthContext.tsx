import { createContext, useState, useEffect, ReactNode } from "react";
import { AuthService } from "../services/AuthService";
import { AuthContextType, User, LoginCredentials } from "../types/AuthTypes";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem('token');
        return token ? { token } : null;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        } else {
            setUser(null);
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await AuthService.login(credentials);
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};