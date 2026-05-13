import FrontendNavbarComponent from "@/components/navbar/FrontendNavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import React from "react";

export default function MapViewLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col h-screen">
            <FrontendNavbarComponent/>
            <div className="flex-1 overflow-hidden min-h-0">
                {children}
            </div>
            <FooterComponent/>
        </div>
    )
}
