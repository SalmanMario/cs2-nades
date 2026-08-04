import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import {UtilityFormType} from "@/types/utility";
import UtilityForm from "@/components/form/UtilityForm";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/$mapName/$id/edit')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const {id, mapName} = Route.useParams();
    const {data: utility} = useQueryApi<{ data: UtilityFormType}>({
        queryKey: ['utility', id],
        method: 'GET',
        url: `/utilities/${id}/edit`,
    })
    return <UtilityForm utility={utility?.data} mapName={mapName}/>
}
