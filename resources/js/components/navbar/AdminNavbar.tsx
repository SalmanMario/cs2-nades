import React from "react";
import {useAuth} from "@/AuthContext";
import {useNavigate} from "@tanstack/react-router";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar";

export default function AdminNavbar() {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
    }

    const home = () => {
        navigate({to: "/admin/dashboard"})
    }

    const maps = () => {
        navigate({to: "/admin/dashboard/maps"})
    }
    return (
        <div>
            <Menubar className="mb-5 h-14">
                <MenubarMenu>
                    <h1 onClick={home} className="ms-10 font-bold text-2xl cursor-pointer">Dashboard</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <h1 onClick={maps} className="ms-10 grow font-bold text-2xl cursor-pointer">Maps</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>
                        <Avatar className="cursor-pointer">
                            <AvatarImage/>
                            <AvatarFallback>CS2</AvatarFallback>
                        </Avatar>
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarGroup>
                            <MenubarItem className="cursor-pointer">Profile</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={handleLogout}>Logout</MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
