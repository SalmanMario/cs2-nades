import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import MapLayoutFrontend from "@/components/MapLayoutFrontend";
import FrontendLayout from "@/layouts/FrontendLayout";
import {useEffect, useState} from "react";

export const Route = createFileRoute('/maps/$mapName/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName} = Route.useParams();
    const [endCoords, setEndCoords] = useState([]);
    const [startCoords, setStartCoords] = useState([])

    const {data: map} = useQueryApi({
        queryKey: ['map'],
        method: 'GET',
        url: `/getMap/${mapName}`,
    })
    const {data: utilityCoordinates} = useQueryApi({
        queryKey: ['utilityCoordinates'],
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
                    x: utility.existing_end_coords_x,
                    y: utility.existing_end_coords_y,
                }))

            );
            setStartCoords(
                utilityCoordinates.data.map((utility) => ({
                    team_id: utility.team_id,
                    start_utility_id: utility.id_existing_start_coords,
                    end_utility_id: utility.id_existing_end_coords,
                    x: utility.existing_start_coords_x,
                    y: utility.existing_start_coords_y,
                }))
            );
        }
    }, [utilityCoordinates]);
    return (
        <FrontendLayout>
            <MapLayoutFrontend mapImage={map?.data?.map_no_callouts} endCoordinates={endCoords} startCoordinates={startCoords}/>
        </FrontendLayout>
    )
}
