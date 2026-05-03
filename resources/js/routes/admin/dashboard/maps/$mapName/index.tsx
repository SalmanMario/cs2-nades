import {createFileRoute, useNavigate} from '@tanstack/react-router'
import AdminLayout from "@/layouts/AdminLayout";
import {DataTable} from "@/components/mapsTable/data-table";
import {utilitiesColumns, Payment} from "@/components/mapsTable/utilities-columns";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/admin/dashboard/maps/$mapName/')({
    loader: async () => {
        return getData()
    },
    component: RouteComponent
})

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "1",
            name: "m@example.com",
            team: "CT",
            utility: "HE",
        },
        {
            id: "2",
            name: "a@example.com",
            team: "T",
            utility: "Smoke",
        },
    ]
}

function RouteComponent() {
    const data = Route.useLoaderData()
    const navigate = useNavigate()
    const {mapName} = Route.useParams()
    const goToCreate = () => {
        navigate({to: "/admin/dashboard/maps/$mapName/create", params: {mapName}})
    }
    return <div>
       <AdminLayout>
           <Button variant="outline" className="mb-5" onClick={goToCreate}>Create Utility</Button>
           <DataTable columns={utilitiesColumns} data={data}/>
       </AdminLayout>
    </div>
}
