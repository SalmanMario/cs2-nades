import FooterComponent from "@/components/FooterComponent";
import React from "react";
import FrontendNavbarComponent from "@/components/navbar/FrontendNavbarComponent";

export default function FrontendLayout({children}: any) {
    return (
        <div className="flex flex-col min-h-screen">
            <FrontendNavbarComponent/>
            <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </div>
            <FooterComponent/>
        </div>
    )
}
