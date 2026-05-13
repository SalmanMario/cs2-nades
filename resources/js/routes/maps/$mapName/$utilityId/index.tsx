import {createFileRoute} from '@tanstack/react-router'
import FrontendLayout from "@/layouts/FrontendLayout";

export const Route = createFileRoute('/maps/$mapName/$utilityId/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName, utilityId} = Route.useParams();
    return <div>
        <FrontendLayout>

        </FrontendLayout>
    </div>
}
