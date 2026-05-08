import {createFileRoute, useNavigate} from '@tanstack/react-router'
import MapsComponent from "@/components/MapsComponent";
import FrontendLayout from "@/layouts/FrontendLayout";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const navigate = useNavigate();
    return (
        <FrontendLayout>
            <MapsComponent onCardClick={(mapName) => navigate({
                to: "/maps/$mapName",
                params: {
                    mapName
                }
            })}/>
        </FrontendLayout>
    )
}
