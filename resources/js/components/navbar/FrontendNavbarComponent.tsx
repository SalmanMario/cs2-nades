import {Menubar, MenubarMenu} from "@/components/ui/menubar";
import React from "react";
import {useNavigate} from "@tanstack/react-router";

export default function FrontendNavbarComponent() {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate({
            to: "/"
        })
    }
    return (
        <div>
            <Menubar className="mb-5 h-20">
                <MenubarMenu>
                    <h1 onClick={goToHome} className="font-bold text-5xl mx-auto cursor-pointer">CS2 Nades</h1>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
