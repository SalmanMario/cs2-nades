import {createFileRoute} from '@tanstack/react-router'
import MapsComponent from "@/components/MapsComponent";
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";

export const Route = createFileRoute('/admin/dashboard/maps/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        <AdminLayout>
            <MapsComponent/>
        </AdminLayout>
    </div>
}
