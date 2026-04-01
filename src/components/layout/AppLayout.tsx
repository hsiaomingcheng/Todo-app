import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* This is where the child components will be rendered */}
                <Outlet />
            </main>
            
            <footer className="bg-gray-800 text-white text-center py-4">
                &copy; 2026 Chris Hsiao. All rights reserved.
            </footer>
        </div>
    );
}