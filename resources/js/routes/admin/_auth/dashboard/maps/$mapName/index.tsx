import {createFileRoute, useNavigate} from '@tanstack/react-router'
import AdminLayout from "@/layouts/AdminLayout";
import {DataTable} from "@/components/mapsTable/data-table";
import {utilitiesColumns} from "@/components/mapsTable/utilities-columns";
import {Button} from "@/components/ui/button";
import {useQueryApi} from "@/hooks/use-query";
import {UtilityResponse} from "@/types/utility";
import UtilityCounter from "@/components/UtilityCounter";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/$mapName/')({
    component: RouteComponent
})

function RouteComponent() {
    const data = Route.useLoaderData()
    const navigate = useNavigate()
    const {mapName} = Route.useParams()
    const {data: utilities, isLoading} = useQueryApi<UtilityResponse>({
        queryKey: ['utilities', mapName],
        method: 'GET',
        url: `/utilities/${mapName}`,
    })
    const goToCreate = () => {
        navigate({to: "/admin/dashboard/maps/$mapName/create", params: {mapName}}).then()
    }
    if (isLoading) return <div>Loading...</div>
    console.log(utilities)
    return <div>
        <AdminLayout>
            <Button variant="outline" className="mb-5" onClick={goToCreate}>Create Utility</Button>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-5">
                <UtilityCounter count={utilities?.total_utilities} type="any" text="Total Utilities:"/>
                <UtilityCounter count={utilities?.total_utilities_ct} type="ct" text="CT Utilities:"/>
                <UtilityCounter count={utilities?.total_utilities_t} type="t" text="T Utilities:"/>
            </div>
            {utilities && (
                <DataTable columns={utilitiesColumns(navigate, mapName)} data={utilities?.data ?? []}/>
            )}
        </AdminLayout>
    </div>
}
