import {createFileRoute, useNavigate} from '@tanstack/react-router'
import AdminLayout from "@/layouts/AdminLayout";
import {DataTable} from "@/components/mapsTable/data-table";
import {utilitiesColumns} from "@/components/mapsTable/utilities-columns";
import {Button} from "@/components/ui/button";
import {useQueryApi} from "@/hooks/use-query";
import {UtilityTable} from "@/types/Utility";

export const Route = createFileRoute('/admin/dashboard/maps/$mapName/')({
    component: RouteComponent
})

function RouteComponent() {
    const data = Route.useLoaderData()
    const navigate = useNavigate()
    const {mapName} = Route.useParams()
    const {data: utilities} = useQueryApi<{data: UtilityTable[]}>({
        queryKey: ['utilities'],
        method: 'GET',
        url: `/utilities/${mapName}`,
    })
    console.log(utilities)
    const goToCreate = () => {
        navigate({to: "/admin/dashboard/maps/$mapName/create", params: {mapName}}).then()
    }
    return <div>
       <AdminLayout>
           <Button variant="outline" className="mb-5" onClick={goToCreate}>Create Utility</Button>
           {utilities && (
               <DataTable columns={utilitiesColumns} data={utilities?.data ?? []}/>
           )}
       </AdminLayout>
    </div>
}
