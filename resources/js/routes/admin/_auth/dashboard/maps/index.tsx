import {createFileRoute, useNavigate} from '@tanstack/react-router'
import MapsComponent from "@/components/MapsComponent";
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    return <div>
        <AdminLayout>
            <MapsComponent onCardClick={(mapName) => navigate({
                to: "/admin/dashboard/maps/$mapName",
                params: {
                    mapName
                }
            })}/>
        </AdminLayout>
    </div>
}
