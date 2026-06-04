import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import MapLayoutFrontend from "@/components/MapLayoutFrontend";
import {useEffect, useState} from "react";
import MapViewLayout from "@/layouts/MapViewLayout";
import {ExistingCoords} from "@/types/coords";
import {Button} from "@/components/ui/button";

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
    const [grenadeType, setGrenadeType] = useState("SMOKE");
    const [teamType, setTeamType] = useState(1);
    const [test1, setTest1] = useState<UtilityCoordinates[]>([]);

    const {data: map, isLoading: mapLoading} = useQueryApi<{ data: MapResponse }>({
        queryKey: ['map', mapName],
        method: 'GET',
        url: `/getMap/${mapName}`,
    })
    const {data: utilityCoordinates, isLoading: utilityLoading} = useQueryApi<{ data: UtilityCoordinates[] }>({
        queryKey: ['utilityCoordinates', mapName],
        method: 'GET',
        url: `/getUtilityCoordinates/${mapName}`,
    })

    useEffect(() => {
        if (utilityCoordinates?.data) {
            setEndCoords(
                utilityCoordinates.data.map((utility) => ({
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
                utilityCoordinates.data.map((utility) => ({
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
    }, [utilityCoordinates]);

    if (mapLoading || utilityLoading) return <div>Loading...</div>;

    const changeGrenadeType = (grenadeType: string) => {
        setGrenadeType(grenadeType);
    }

    const filterEndCoords = (endCoordinates: UtilityCoordinates[]) => {
        return endCoordinates.filter((e) => e.type === grenadeType && e.team_id === teamType);
    }

    const filterStartCoords = (startCoordinates: UtilityCoordinates[]) => {
        return startCoordinates.filter((e) => e.type === grenadeType && e.team_id === teamType)
    }

    return (
        <MapViewLayout>
            <Button variant="outline" intent="info" onClick={() => changeGrenadeType("SMOKE")}>Smoke</Button>
            <Button variant="outline" intent="info" onClick={() => changeGrenadeType("HE_GRENADE")}>Grenade</Button>
            <Button variant="outline" intent="info" onClick={() => changeGrenadeType("FLASH")}>Flashbang</Button>
            <Button variant="outline" intent="info" onClick={() => changeGrenadeType("INCENDIARY")}>Molotov</Button>
            <Button variant="outline" intent="info" onClick={() => setTeamType(1)}>T</Button>
            <Button variant="outline" intent="info" onClick={() => setTeamType(2)}>CT</Button>
            <MapLayoutFrontend
                mapImage={map?.data?.map_no_callouts}
                endCoordinates={filterEndCoords(endCoords)}
                startCoordinates={filterStartCoords(startCoords)}
                teamType={teamType}
            />
        </MapViewLayout>

    )
}
