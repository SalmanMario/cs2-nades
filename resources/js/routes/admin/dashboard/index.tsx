import {createFileRoute, redirect} from '@tanstack/react-router'
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import {UtilityChart} from "@/components/UtilityChart";
import {useQueryApi} from "@/hooks/use-query";
import {UtilityStatsResponse} from "@/types/utility";

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
    const {data: utility} = useQueryApi<UtilityStatsResponse>({
        queryKey: ["utilityStats"],
        method: "GET",
        url: "/getUtilityStats",
    })
    return (
        <div>
            <AdminLayout>
                <UtilityChart utility={utility}/>
            </AdminLayout>
        </div>
    )
}
