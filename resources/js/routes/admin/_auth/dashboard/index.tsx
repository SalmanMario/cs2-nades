import {createFileRoute, redirect} from '@tanstack/react-router'
import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import {UtilityChart} from "@/components/chart/UtilityChart";
import {useQueryApi} from "@/hooks/use-query";
import {UtilityStatsResponse} from "@/types/utility";

export const Route = createFileRoute('/admin/_auth/dashboard/')({
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
