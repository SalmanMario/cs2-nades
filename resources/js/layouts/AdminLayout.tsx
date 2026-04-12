import AdminNavbarComponent from "@/components/AdminNavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import React from "react";

export default function AdminLayout({children}: any) {


    return (
        <div className="flex flex-col min-h-screen">
            <AdminNavbarComponent/>
            <div className="flex-1 mx-auto">
                {children}
            </div>
            <FooterComponent/>
        </div>
    )
}
