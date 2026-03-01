import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator, MenubarShortcut,
    MenubarTrigger
} from "@/components/ui/menubar";
import React from "react";
import {useAuth} from "@/AuthContext";
import {useNavigate} from "@tanstack/react-router";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function AdminNavbarComponent() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({to: "/admin/login"})
    }

    const home = () => {
        navigate({to: "/admin/dashboard"})
    }
    return (
        <div>
            <Menubar className="mb-5 h-14">
                <MenubarMenu>
                    <h1 className="font-bold text-4xl m-5">CS2 Nades</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <h1 onClick={home} className="ms-10 grow font-bold text-2xl">Home</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>
                        <Avatar>
                            <AvatarImage/>
                            <AvatarFallback>CS2</AvatarFallback>
                        </Avatar>
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarGroup>
                            <MenubarItem>Profile</MenubarItem>
                            <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
