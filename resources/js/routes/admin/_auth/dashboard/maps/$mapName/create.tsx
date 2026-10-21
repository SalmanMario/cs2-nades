import {createFileRoute} from '@tanstack/react-router'
import {firstToUpperCase, pageTitle} from "@/hooks/helper";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import UtilityForm from "@/components/form/UtilityForm";
import api from "@/lib/api";
import {UtilityRequestPrefill} from "@/types/utility";

type CreateSearch = {
    // id of a player's nade request to pre-fill the form with
    request?: number,
}

export const Route = createFileRoute('/admin/_auth/dashboard/maps/$mapName/create')({
    head: ({params}) => ({meta: [{title: pageTitle(`New Lineup - ${firstToUpperCase(params.mapName)}`, true)}]}),
    validateSearch: (search: Record<string, unknown>): CreateSearch => ({
        request: Number(search.request) > 0 ? Number(search.request) : undefined,
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName} = Route.useParams()
    const {request} = Route.useSearch()

    // POST because it copies the request files into new attachments, so fetch it only once
    const {data: prefill, isLoading} = useQuery<UtilityRequestPrefill>({
        queryKey: ['utilityRequestPrefill', request],
        queryFn: async () => (await api.post<UtilityRequestPrefill>(`/utility-requests/${request}/prefill`)).data,
        enabled: !!request,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    });

    if (request && isLoading) {
        return <div className="py-20 text-center text-zinc-400">Loading request...</div>
    }

    return (
        <UtilityForm utility={null} mapName={mapName} prefill={prefill}/>
    )
}
