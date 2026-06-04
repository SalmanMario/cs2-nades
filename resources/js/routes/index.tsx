import {createFileRoute, useNavigate} from '@tanstack/react-router'
import CardMap from "@/components/CardMap";
import FrontendLayout from "@/layouts/FrontendLayout";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const navigate = useNavigate();
    return (
        <FrontendLayout>
            <CardMap onCardClick={(mapName) => navigate({
                to: "/maps/$mapName",
                params: {
                    mapName
                }
            })}/>
        </FrontendLayout>
    )
}
