import {createFileRoute, useNavigate} from '@tanstack/react-router'
import CardMap from "@/components/card/CardMap";
import FrontendLayout from "@/layouts/FrontendLayout";
import {useQueryApi} from "@/hooks/use-query";
import {MapsOverviewResponse} from "@/types/map";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const navigate = useNavigate();

    const {data: overview, isLoading, error} = useQueryApi<MapsOverviewResponse>({
        queryKey: ["mapsOverview"],
        method: "GET",
        url: "/mapsOverview",
    });

    return (
        <FrontendLayout>
            {isLoading && (
                <div className="py-20 text-center text-zinc-400">
                    Loading maps...
                </div>
            )}
            {error && (
                <div className="py-20 text-center text-red-500">
                    Error: {error.message}
                </div>
            )}
            {!isLoading && !error && (
                <CardMap
                    maps={overview?.maps}
                    nadeCounts={overview?.nade_count}
                    onCardClick={(mapName) => navigate({
                        to: "/maps/$mapName",
                        params: {
                            mapName
                        }
                    })}
                />
            )}
        </FrontendLayout>
    )
}
