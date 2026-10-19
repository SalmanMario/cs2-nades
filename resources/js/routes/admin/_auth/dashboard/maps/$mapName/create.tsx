import {createFileRoute} from '@tanstack/react-router'
import {firstToUpperCase, pageTitle} from "@/hooks/helper";
import React from "react";
import UtilityForm from "@/components/form/UtilityForm";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/$mapName/create')({
    head: ({params}) => ({meta: [{title: pageTitle(`New Lineup - ${firstToUpperCase(params.mapName)}`, true)}]}),
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName} = Route.useParams()
    return (
        <UtilityForm utility={null} mapName={mapName}/>
    )
}
