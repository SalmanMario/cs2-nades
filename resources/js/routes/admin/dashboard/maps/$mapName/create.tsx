import {createFileRoute} from '@tanstack/react-router'
import React from "react";
import UtilityFormComponent from "@/components/form/utility-form-component";

export const Route = createFileRoute('/admin/dashboard/maps/$mapName/create')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName} = Route.useParams()
    return (
        <UtilityFormComponent utility={null} mapName={mapName}/>
    )
}
