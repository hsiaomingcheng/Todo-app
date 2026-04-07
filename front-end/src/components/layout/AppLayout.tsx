import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
    const { logout } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
                    <button 
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* This is where the child components will be rendered */}
                <Outlet />
            </main>
            
            <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
                &copy; 2026 Chris Hsiao. All rights reserved.
            </footer>
        </div>
    );
}