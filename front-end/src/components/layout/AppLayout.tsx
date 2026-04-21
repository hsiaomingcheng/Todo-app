import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppLayout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (!user) return "??";
        const firstInitial = user.first_name?.[0] || "";
        const lastInitial = user.last_name?.[0] || "";
        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    return (
        <div className="flex flex-col min-h-screen bg-app-bg">
            {/* Header - spec color palette */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center gap-4">
                    {/* Logo / App title */}
                    <Link to="/boards" className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-app-text">TodoFlow</h1>
                    </Link>

                    {/* Global search - center (hidden on mobile, icon only on tablet) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B778C]" /> */}
                            <Input
                                type="search"
                                placeholder="Search cards..."
                                className="pl-10 bg-app-bg border-gray-300 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Search icon only on mobile/tablet */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => {
                            // TODO: Open mobile search modal
                        }}
                    >
                        {/* <Search className="h-5 w-5 text-[#6B778C]" /> */}
                    </Button>

                    {/* User menu */}
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar_url} alt={user?.first_name} />
                                        <AvatarFallback className="bg-app-primary text-white text-xs">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2 py-1.5 text-sm">
                                    <p className="font-medium text-app-text">
                                        {user?.first_name} {user?.last_name}
                                    </p>
                                    <p className="text-xs text-app-text-subtle truncate">
                                        @{user?.user_account}
                                    </p>
                                </div>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                                        Settings
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="text-app-danger focus:text-app-danger focus:bg-red-50"
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <main className="flex-grow w-full p-4">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-app-text text-white text-center py-4 mt-auto">
                <p className="text-sm">
                    &copy; 2026 Chris Hsiao. All rights reserved.
                </p>
            </footer>
        </div>
    );
}