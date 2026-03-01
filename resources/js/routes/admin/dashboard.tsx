import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import React from "react";
import MapsComponent from "@/components/MapsComponent";
import AdminLayout from "@/layouts/AdminLayout";

export const Route = createFileRoute('/admin/dashboard')({
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
                {/*<MapsComponent/>*/}
            </AdminLayout>
        </div>
    )
}
