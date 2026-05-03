import {createFileRoute, redirect} from '@tanstack/react-router'
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import MapLayout from "@/components/MapLayout";

export const Route = createFileRoute('/admin/dashboard/')({
    beforeLoad: async ({context}) => {
        const auth: AuthContextType = (context as { auth: AuthContextType }).auth;
        const user: LoginData = auth.user ?? (await auth.loadUser());

        if (!user) {
            throw redirect({to: "/admin/login"});
        }

        return {user};
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <AdminLayout>
            </AdminLayout>
        </div>
    )
}
