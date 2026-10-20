import {Menubar, MenubarMenu} from "@/components/ui/menubar";
import React from "react";
import {useNavigate} from "@tanstack/react-router";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {initials} from "@/hooks/helper";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/AuthContext";
import {Menu} from "lucide-react";

const NAV_LINKS = [
    {to: "/popular", label: "Popular"},
    {to: "/latest", label: "Latest"},
    {to: "/my-favorites", label: "My Favorites"},
] as const;

export default function FrontendNavbar() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const goToHome = () => {
        navigate({to: "/"}).then();
    };

    return (
        <div>
            <Menubar className="h-20">
                <MenubarMenu className="relative flex items-center w-full">
                    <h1
                        onClick={goToHome}
                        className="font-bold text-2xl md:text-4xl cursor-pointer ms-4 md:ms-12 whitespace-nowrap"
                    >
                        CS2 Nades
                    </h1>
                    <div className="ml-auto flex items-center gap-3 md:gap-10 me-4 md:me-12">
                        {NAV_LINKS.map((link) => (
                            <div key={link.to} className="hidden md:block">
                                <Button onClick={() => navigate({to: link.to})}>{link.label}</Button>
                            </div>
                        ))}

                        {/* phones: the links (and login/register for guests) live in this menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 md:hidden" aria-label="Open menu">
                                <Menu className="h-6 w-6"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {NAV_LINKS.map((link) => (
                                    <DropdownMenuItem key={link.to} className="cursor-pointer" onClick={() => navigate({to: link.to})}>
                                        {link.label}
                                    </DropdownMenuItem>
                                ))}
                                {!user && (
                                    <>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({to: "/login"})}>Login</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({to: "/register"})}>Register</DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {user ? (
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="rounded-full">
                                        <Avatar className="cursor-pointer">
                                            <AvatarFallback className="bg-orange-500 font-semibold text-black">
                                                {initials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>
                                                <div>{user.name}</div>
                                                <div className="text-xs font-normal text-zinc-400">{user.email}</div>
                                            </DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({to: "/profile"})}>Profile</DropdownMenuItem>
                                            {user.role === "ADMIN" && (
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({to: "/admin/dashboard"})}>
                                                    Admin dashboard
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>Logout</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="hidden items-center gap-3 md:flex">
                                <Button variant="outline" onClick={() => navigate({to: "/login"})}>Login</Button>
                                <Button onClick={() => navigate({to: "/register"})}
                                        className="bg-orange-500 text-black hover:bg-orange-400">
                                    Register
                                </Button>
                            </div>
                        )}
                    </div>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
