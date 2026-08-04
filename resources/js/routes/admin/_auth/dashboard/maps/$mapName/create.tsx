import {createFileRoute} from '@tanstack/react-router'
import React from "react";
import UtilityForm from "@/components/form/UtilityForm";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/$mapName/create')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName} = Route.useParams()
    return (
        <UtilityForm utility={null} mapName={mapName}/>
    )
}
