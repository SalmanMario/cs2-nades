import AdminNavbarComponent from "@/components/navbar/AdminNavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import React from "react";

export default function AdminLayout({children}: any) {

    return (
        <div className="flex flex-col min-h-screen">
            <AdminNavbarComponent/>
            <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </div>
            <FooterComponent/>
        </div>
    )
}
