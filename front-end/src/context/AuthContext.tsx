import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// 1. Define the shape of our context
interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

// 2. Create the context with empty default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    // Initialize state from localStorage so the user stays logged in if they refresh
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    // The login function saves the token
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        navigate("/boards");
    };

    // The logout function removes the token and redirects
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 4. Create a custom hook to easily use this context in any component
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
