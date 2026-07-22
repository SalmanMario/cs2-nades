import {Menubar, MenubarMenu} from "@/components/ui/menubar";
import React from "react";
import {useNavigate} from "@tanstack/react-router";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function FrontendNavbarComponent() {
    const navigate = useNavigate();

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
                            <Button>My Favorites</Button>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full">
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="grayscale" />
                                        <AvatarFallback>CS</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
