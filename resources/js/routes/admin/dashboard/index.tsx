import {createFileRoute, redirect} from '@tanstack/react-router'
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";

export const Route = createFileRoute('/admin/dashboard/')({
    beforeLoad: async ({context}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: Login = auth.user ?? (await auth.loadUser());

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
