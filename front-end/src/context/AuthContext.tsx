import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "@/api/apis";

// 1. Define the shape of our context
interface AuthContextType {
    token: string | null;
    userDetails: UserDetails | null;
    login: (token: string) => void;
    logout: () => void;
}

interface UserDetails {
    user_account: string;
    email: string;
    first_name: string;
    last_name: string;
}

// 2. Create the context with empty default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    // Initialize state from localStorage so the user stays logged in if they refresh
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userDetails, setUserDetails] = useState<UserDetails | null>({
        user_account: '',
        email: '',
        first_name: '',
        last_name: '',
    });

    // Handle async logic inside useEffect
    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const userDetails = await getUserDetails();
                    setUserDetails({ ...userDetails.data });
                } catch (error) {
                    console.error("Failed to fetch user", error);
                }
            }
        };

        fetchUser();
    }, [token]); // Dependencies

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
        <AuthContext.Provider value={{ token, userDetails, login, logout }}>
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
