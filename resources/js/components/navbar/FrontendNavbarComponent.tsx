import {Menubar, MenubarMenu} from "@/components/ui/menubar";
import React from "react";
import {useNavigate} from "@tanstack/react-router";

export default function FrontendNavbarComponent() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate({ to: "/" }).then();
    };

    return (
        <div>
            <Menubar className="mb-5 h-20">
                <MenubarMenu className="relative flex items-center w-full">
                    <h1
                        onClick={goToHome}
                        className="absolute left-1/2 -translate-x-1/2 font-bold text-5xl cursor-pointer"
                    >
                        CS2 Nades
                    </h1>

                </MenubarMenu>
            </Menubar>
        </div>
    )
}
