import {createFileRoute, useNavigate} from '@tanstack/react-router'
import CardMap from "@/components/CardMap";
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import AdminNavbarComponent from "@/components/navbar/AdminNavbarComponent";
import FooterComponent from "@/components/FooterComponent";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    return (
        <div>
            <AdminNavbarComponent/>
            <div className="mx-auto w-full max-w-[1900px] flex-1 px-6 py-10">
                <CardMap onCardClick={(mapName) => navigate({
                    to: "/admin/dashboard/maps/$mapName",
                    params: {
                        mapName
                    }
                })}/>
            </div>
            <FooterComponent/>
        </div>
    )
}
