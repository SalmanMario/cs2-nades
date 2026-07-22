import {UtilityCoordinates} from "@/routes/maps/$mapName";

export type MapResponse = {
    id: string,
    name: string,
    image: string,
    map_no_callouts: string,
    map_card_image: string,
    map_callouts: string,
    number_of_utilities: number,
}

export type LayoutResponse = {
    maps_count: number,
    lineups: number,
    maps: MapResponse[],
    map_counts: number,
    nade_types: Nade[],
    utilities: {
        nades: Nade[],
    }
}

type MapOverview = {
    maps: MapResponse[],
    map_counts: number,
    nade_count: NadeCount[]
}

export type MapOverviewResponse = {
    map: MapResponse,
    maps: MapResponse[],
    utilities: {
        nades: Nade[],
    },
    utilityCoordinates: UtilityCoordinates[],
    teams: Team[],
}
