import {createFileRoute, useNavigate} from '@tanstack/react-router'
import AdminLayout from "@/layouts/AdminLayout";
import {DataTable} from "@/components/mapsTable/data-table";
import {utilitiesColumns} from "@/components/mapsTable/utilities-columns";
import {Button} from "@/components/ui/button";
import {useQueryApi} from "@/hooks/use-query";
import StatCard from "@/components/StatCard";
import {BackendMapOverview} from "@/types/utility";
import BackendSidebar from "@/components/BackendSidebar";
import AdminNavbarComponent from "@/components/navbar/AdminNavbarComponent";

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
    return (
        <div>
            <AdminNavbarComponent/>
            <div className="flex min-h-screen">
                <BackendSidebar maps={utilities.maps}/>

                <main className="flex-1 overflow-y-auto">

                    <div className="mx-auto max-w-[1700px] p-10">
                        <div className="flex items-center justify-between">
                            <div className="mb-3">
                                <h1 className="text-4xl mb-3 font-bold">Utilities</h1>
                                <p>Manage all utilities</p>
                            </div>
                            <div>
                                <Button variant="outline" className="mb-5" onClick={goToCreate}>Create Utility</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-5">
                            <StatCard label={utilities.map?.name} value={utilities.map?.number_of_utilities}
                                      image={utilities.map?.image}/>
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
                            <DataTable columns={utilitiesColumns(navigate, mapName)}
                                       data={utilities.utilities?.data ?? []}/>
                        )}
                    </div>

                </main>
            </div>
        </div>
    )
}
