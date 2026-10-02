import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

export default function LandingNavbar() {
    const { token } = useAuth();

    return (
        <header className="border-b border-[#ECEEF1] bg-white">
            <nav
                aria-label="Main"
                className="mx-auto flex h-16 max-w-[1200px] items-center justify-end px-6"
            >
                {token ? (
                    <Button
                        asChild
                        className="h-11 gap-2 rounded-[10px] bg-[#0F766E] px-[18px] font-semibold text-white hover:bg-[#0F766E]/90"
                    >
                        <Link to="/boards">
                            Go to my boards
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="ghost"
                            className="h-11 rounded-[10px] px-4 text-[#14161A]"
                        >
                            <Link to="/login">Log in</Link>
                        </Button>
                        <Button
                            asChild
                            className="h-11 rounded-[10px] bg-[#0F766E] px-[18px] font-semibold text-white hover:bg-[#0F766E]/90"
                        >
                            <Link to="/register">Sign up</Link>
                        </Button>
                    </div>
                )}
            </nav>
        </header>
    );
}
