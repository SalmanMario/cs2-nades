import {createFileRoute, useNavigate} from '@tanstack/react-router'
import AdminLayout from "@/layouts/AdminLayout";
import {DataTable} from "@/components/mapsTable/data-table";
import {utilitiesColumns} from "@/components/mapsTable/utilities-columns";
import {Button} from "@/components/ui/button";
import {useQueryApi} from "@/hooks/use-query";
import StatCard from "@/components/StatCard";
import {BackendMapOverview} from "@/types/utility";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/$mapName/')({
    component: RouteComponent
})

function RouteComponent() {
    const navigate = useNavigate()
    const {mapName} = Route.useParams()

    const {data: utilities, isLoading} = useQueryApi<BackendMapOverview>({
        queryKey: ['utilities', mapName],
        method: "GET",
        url: `/backend-map-overview/${mapName}`
    })

    const goToCreate = () => {
        navigate({to: "/admin/dashboard/maps/$mapName/create", params: {mapName}}).then()
    }
    if (isLoading) return <div>Loading...</div>
    return <div>
        <AdminLayout>
            <Button variant="outline" className="mb-5" onClick={goToCreate}>Create Utility</Button>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-5">
                <StatCard label={utilities.map?.name} value={utilities.map?.number_of_utilities} image={utilities.map?.image}/>
                {utilities.utilities?.countByTeam?.map((nade) => (
                    <StatCard label={nade.name} value={nade.count ?? 0} image={nade.image}/>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-5">
                {utilities.utilities?.count?.map((nade) => (
                    <StatCard label={nade.name} value={nade.count ?? 0} image={nade.image}/>
                ))}
            </div>
            {utilities.utilities && (
                <DataTable columns={utilitiesColumns(navigate, mapName)} data={utilities.utilities?.data ?? []}/>
            )}
        </AdminLayout>
    </div>
}
