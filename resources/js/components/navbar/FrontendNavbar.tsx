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
                        className="font-bold text-4xl cursor-pointer ms-12"
                    >
                        CS2 Nades
                    </h1>
                    <div className="ml-auto flex items-center gap-10 me-12">
                        <div>
                            <Button>Popular</Button>
                        </div>
                        <div>
                            <Button>Recently Updated</Button>
                        </div>
                        <div>
                            <Button onClick={() => navigate({to: "/my-favorites"})}>My Favorites</Button>
                        </div>
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
                            <div className="flex items-center gap-3">
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
