import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import MapLayoutFrontend from "@/components/MapLayoutFrontend";
import FrontendLayout from "@/layouts/FrontendLayout";
import {useEffect, useState} from "react";
import MapViewLayout from "@/layouts/MapViewLayout";

export const Route = createFileRoute('/maps/$mapName/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName} = Route.useParams();
    const [endCoords, setEndCoords] = useState([]);
    const [startCoords, setStartCoords] = useState([])

    const {data: map, isLoading: mapLoading} = useQueryApi({
        queryKey: ['map', mapName],
        method: 'GET',
        url: `/getMap/${mapName}`,
    })
    const {data: utilityCoordinates, isLoading: utilityLoading} = useQueryApi({
        queryKey: ['utilityCoordinates', mapName],
        method: 'GET',
        url: `/getUtilityCoordinates/${mapName}`,
    })

    useEffect(() => {
        if (utilityCoordinates?.data) {
            setEndCoords(
                utilityCoordinates.data.map((utility) => ({
                    team_id: utility.team_id,
                    start_utility_id: utility.id_existing_start_coords,
                    end_utility_id: utility.id_existing_end_coords,
                    utility_type: utility.type,
                    utility_image: utility.image,
                    x: utility.existing_end_coords_x,
                    y: utility.existing_end_coords_y,
                }))
            );
            setStartCoords(
                utilityCoordinates.data.map((utility) => ({
                    utility_id: utility.utility_id,
                    team_id: utility.team_id,
                    start_utility_id: utility.id_existing_start_coords,
                    end_utility_id: utility.id_existing_end_coords,
                    utility_type: utility.type,
                    utility_image: utility.image,
                    x: utility.existing_start_coords_x,
                    y: utility.existing_start_coords_y,
                }))
            );
        }
    }, [utilityCoordinates]);

    if (mapLoading || utilityLoading) return <div>Loading...</div>;

    return (
        <MapViewLayout>
            <MapLayoutFrontend
                mapImage={map?.data?.map_no_callouts}
                endCoordinates={endCoords}
                startCoordinates={startCoords}
            />
        </MapViewLayout>
    )
}
