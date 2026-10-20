import React from "react";
import {useAuth} from "@/AuthContext";
import {useNavigate} from "@tanstack/react-router";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger
} from "@/components/ui/menubar";
import {initials} from "@/hooks/helper";

export default function AdminNavbar() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <Menubar className="mb-5 h-14">
                <MenubarMenu>
                    <h1 onClick={() => navigate({to: "/admin/dashboard"})} className="ms-10 font-bold text-2xl cursor-pointer">Dashboard</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <h1 onClick={() => navigate({to: "/admin/dashboard/maps"})} className="ms-10 grow font-bold text-2xl cursor-pointer">Maps</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>
                        <Avatar className="cursor-pointer">
                            <AvatarFallback className="bg-orange-500 font-semibold text-black">
                                {user ? initials(user.name) : "CS"}
                            </AvatarFallback>
                        </Avatar>
                    </MenubarTrigger>
                    <MenubarContent align="end">
                        {user && (
                            <>
                                <MenubarLabel>
                                    <div>{user.name}</div>
                                    <div className="text-xs font-normal text-zinc-400">{user.email}</div>
                                </MenubarLabel>
                                <MenubarSeparator/>
                            </>
                        )}
                        <MenubarGroup>
                            <MenubarItem className="cursor-pointer">Profile</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={() => navigate({to: "/"})}>
                                Frontend
                            </MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={async () => await logout()}>Logout</MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
