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
import {useQueryApi} from "@/hooks/use-query";
import {FlaggedUtilityResponse, UtilityRequestResponse} from "@/types/utility";

export default function AdminNavbar() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    // same query as the flagged page, so the count updates after a dismiss
    const {data: flagged} = useQueryApi<FlaggedUtilityResponse[]>({
        queryKey: ["flaggedUtilities"],
        method: "GET",
        url: "/flagged-utilities",
    });

    // same query as the requests page
    const {data: requests} = useQueryApi<UtilityRequestResponse[]>({
        queryKey: ["utilityRequests"],
        method: "GET",
        url: "/utility-requests",
    });
    const pendingRequests = requests?.filter((request) => request.status === "PENDING").length;

    return (
        <div>
            <Menubar className="mb-5 h-14">
                <MenubarMenu>
                    <h1 onClick={() => navigate({to: "/admin/dashboard"})} className="ms-10 font-bold text-2xl cursor-pointer">Dashboard</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <h1 onClick={() => navigate({to: "/admin/dashboard/maps"})} className="ms-10 font-bold text-2xl cursor-pointer">Maps</h1>
                </MenubarMenu>
                <MenubarMenu>
                    <h1 onClick={() => navigate({to: "/admin/dashboard/flagged"})} className="ms-10 flex items-center gap-2 font-bold text-2xl cursor-pointer">
                        Flagged
                        {!!flagged?.length && (
                            <span className="rounded-full bg-red-500 px-2 text-sm text-white">{flagged.length}</span>
                        )}
                    </h1>
                </MenubarMenu>
                <MenubarMenu>
                    <h1 onClick={() => navigate({to: "/admin/dashboard/requests"})} className="ms-10 grow flex items-center gap-2 font-bold text-2xl cursor-pointer">
                        Requests
                        {!!pendingRequests && (
                            <span className="rounded-full bg-orange-500 px-2 text-sm text-black">{pendingRequests}</span>
                        )}
                    </h1>
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
                            <MenubarItem className="cursor-pointer" onClick={() => navigate({to: "/profile"})}>Profile</MenubarItem>
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
