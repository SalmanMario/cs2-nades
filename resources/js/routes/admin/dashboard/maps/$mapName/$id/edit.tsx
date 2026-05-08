import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import {UtilityForm} from "../../../../../../types/utility";
import UtilityFormComponent from "@/components/form/utility-form-component";

export const Route = createFileRoute('/admin/dashboard/maps/$mapName/$id/edit')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const {id, mapName} = Route.useParams();
    const {data: utility} = useQueryApi<{ data: UtilityForm}>({
        queryKey: ['utility', id],
        method: 'GET',
        url: `/utilities/${id}/edit`,
    })
    return <UtilityFormComponent utility={utility?.data} mapName={mapName}/>
}
