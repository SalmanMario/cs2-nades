import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import MapLayoutFrontend from "@/components/layout/MapLayoutFrontend";
import {useEffect, useMemo, useState} from "react";
import MapViewLayout from "@/layouts/MapViewLayout";
import {ExistingCoords} from "@/types/coords";
import MapSidebar from "@/components/sidebar/MapSidebar";
import {MapOverviewResponse} from "@/types/map";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";
import DialogSearch from "@/components/search/DialogSearch";
import UtilityPreviewPanel from "@/components/panel/UtilityPreviewPanel";
import {firstToUpperCase, pageTitle} from "@/hooks/helper";

export const Route = createFileRoute('/maps/$mapName/')({
    head: ({params}) => ({
        meta: [{title: pageTitle(`${firstToUpperCase(params.mapName)} Lineups`)}],
    }),
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
    const [showSearchDialog, setShowSearchDialog] = useState(false)
    const [selectedUtilityId, setSelectedUtilityId] = useState<number | null>(null);

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

    const filterCoords = (coordinates: UtilityCoordinates[]) => {
        let filteredCoords;
        if (!grenadeType) return coordinates;

        grenadeType === "ANY" ? filteredCoords = coordinates : filteredCoords = coordinates.filter((e) => e.type === grenadeType);

        if (teamType === 1) {
            return filteredCoords.filter((e) => e.team_id === 1);
        } else if (teamType === 2) {
            return filteredCoords.filter((e) => e.team_id === 2);
        } else {
            return filteredCoords;
        }
    }

    // Memoized so the map doesn't reset its active markers on every re-render
    const filteredEndCoords = useMemo(() => filterCoords(endCoords), [endCoords, grenadeType, teamType]);
    const filteredStartCoords = useMemo(() => filterCoords(startCoords), [startCoords, grenadeType, teamType]);

    useEffect(() => {
        setSelectedUtilityId(null);
    }, [grenadeType, teamType, mapName]);

    // below xl the preview sits under the map, so bring it into view when a marker is tapped
    useEffect(() => {
        if (selectedUtilityId === null || window.matchMedia("(min-width: 1280px)").matches) return;
        document.getElementById("utility-preview")?.scrollIntoView({behavior: "smooth", block: "start"});
    }, [selectedUtilityId]);

    if (infoLoading) return <div>Loading...</div>;

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
                <div id="utility-preview" className="scroll-mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:p-6">
                    <h3 className="text-lg mb-3 font-semibold text-white">
                        Search a utility
                    </h3>
                    <div className="max-w-3xl mb-5">
                        <InputGroup
                            className=" cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900/80 backdrop-blur"
                        >
                            <InputGroupInput
                                readOnly
                                onClick={() => setShowSearchDialog(true)}
                                placeholder="Search lineups for this map"
                                className="cursor-pointer border-0 bg-transparent text-base placeholder:text-zinc-500 focus-visible:ring-0"
                            />

                            <InputGroupAddon className="border-l border-zinc-700 px-5">
                                <Search className="h-5 w-5 text-zinc-400" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    {selectedUtilityId !== null ? (
                        <UtilityPreviewPanel
                            mapName={mapName}
                            utilityId={selectedUtilityId}
                            onClose={() => setSelectedUtilityId(null)}
                        />
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-white">
                                Select a lineup
                            </h3>

                            <p className="mt-2 text-zinc-400">
                                Click a marker on the map to see its details.
                            </p>
                        </>
                    )}
                </div>
            }
        >
            <MapLayoutFrontend
                mapImage={info?.map?.map_no_callouts}
                endCoordinates={filteredEndCoords}
                startCoordinates={filteredStartCoords}
                teamType={teamType}
                selectedUtilityId={selectedUtilityId}
                onSelectUtility={setSelectedUtilityId}
            />

            <DialogSearch setShowSearchDialog={setShowSearchDialog} showSearchDialog={showSearchDialog} url="/search-by-map" params={{map: mapName}}/>
        </MapViewLayout>
    )
}
