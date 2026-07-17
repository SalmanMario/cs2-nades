import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import MapLayoutFrontend from "@/components/MapLayoutFrontend";
import {useEffect, useState} from "react";
import MapViewLayout from "@/layouts/MapViewLayout";
import {ExistingCoords} from "@/types/coords";
import MapSidebar from "@/components/MapSidebar";
import {MapOverviewResponse} from "@/types/map";

export const Route = createFileRoute('/maps/$mapName/')({
    component: RouteComponent,
})

export type UtilityCoordinates = {
    utility_id: number;
    team_id: number;
    existing_start_coords: ExistingCoords;
    existing_end_coords: ExistingCoords;
    start_utility_id: number;
    end_utility_id: number;
    type: string;
    image: string;
    x: number;
    y: number;
}

function RouteComponent() {
    const {mapName} = Route.useParams();
    const [endCoords, setEndCoords] = useState<UtilityCoordinates[]>([]);
    const [startCoords, setStartCoords] = useState<UtilityCoordinates[]>([])
    const [grenadeType, setGrenadeType] = useState("ANY");
    const [teamType, setTeamType] = useState(3);

    const {data: info, isLoading: infoLoading} = useQueryApi<MapOverviewResponse>({
        queryKey:['info', mapName],
        method:"GET",
        url:"/mapOverview",
        params:{
            map: mapName
        }
    })

    useEffect(() => {
        if (info?.utilityCoordinates) {
            setEndCoords(
                info.utilityCoordinates.map((utility) => ({
                    utility_id: utility.utility_id,
                    team_id: utility.team_id,
                    start_utility_id: utility.existing_start_coords.id,
                    end_utility_id: utility.existing_end_coords.id,
                    existing_start_coords: utility.existing_start_coords,
                    existing_end_coords: utility.existing_end_coords,
                    type: utility.type,
                    image: utility.image,
                    x: utility.existing_end_coords.x,
                    y: utility.existing_end_coords.y,
                }))
            );
            setStartCoords(
                info.utilityCoordinates.map((utility) => ({
                    utility_id: utility.utility_id,
                    team_id: utility.team_id,
                    start_utility_id: utility.existing_start_coords.id,
                    end_utility_id: utility.existing_end_coords.id,
                    existing_start_coords: utility.existing_start_coords,
                    existing_end_coords: utility.existing_end_coords,
                    type: utility.type,
                    image: utility.image,
                    x: utility.existing_start_coords.x,
                    y: utility.existing_start_coords.y,
                }))
            );
        }
    }, [info]);

    if (infoLoading) return <div>Loading...</div>;

    const filterEndCoords = (endCoordinates: UtilityCoordinates[]) => {
        let filteredCoords;
        if (!grenadeType) return endCoordinates;

        grenadeType === "ANY" ? filteredCoords = endCoordinates : filteredCoords = endCoordinates.filter((e) => e.type === grenadeType);

        if (teamType === 1) {
            return filteredCoords.filter((e) => e.team_id === 1);
        } else if (teamType === 2) {
            return filteredCoords.filter((e) => e.team_id === 2);
        } else {
            return filteredCoords;
        }
    }

    const filterStartCoords = (startCoordinates: UtilityCoordinates[]) => {
        let filteredCoords;
        if (!grenadeType) return startCoordinates;

        grenadeType === "ANY" ? filteredCoords = startCoordinates : filteredCoords = startCoordinates.filter((e) => e.type === grenadeType);

        if (teamType === 1) {
            return filteredCoords.filter((e) => e.team_id === 1);
        } else if (teamType === 2) {
            return filteredCoords.filter((e) => e.team_id === 2);
        } else {
            return filteredCoords;
        }
    }

    return (
        <MapViewLayout
            info={info}
            sidebar={
                <MapSidebar
                    info={info}
                    onGrenadeTypeChange={setGrenadeType}
                    onTeamTypeChange={setTeamType}
                    grenadeType={grenadeType}
                    teamType={teamType}
                />
            }
            rightPanel={
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="text-lg font-semibold text-white">
                        Select a lineup
                    </h3>

                    <p className="mt-2 text-zinc-400">
                        Click a marker on the map to see its details.
                    </p>
                </div>
            }
        >
            <MapLayoutFrontend
                mapImage={info?.map?.map_no_callouts}
                endCoordinates={filterEndCoords(endCoords)}
                startCoordinates={filterStartCoords(startCoords)}
                teamType={teamType}
            />
        </MapViewLayout>
    )
}
