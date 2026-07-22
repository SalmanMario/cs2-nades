import {Coords, ExistingCoords} from "@/types/coords";
import {MovementEnum, TechniqueEnum, UtilityEnum, TeamEnum, KeyEnum} from "@/types/enums";
import {MapResponse} from "@/types/map";

export type UtilityType = {
    id: string,
    name: string,
    image: string,
}

export type UtilityTable = {
    id: string
    grenade_name: string
    team_type: TeamEnum
    utility_type: UtilityEnum,
    utility_image: string,
    start_coords: Coords,
    end_coords: Coords,
    technique_type: TechniqueEnum
    movement_type: MovementEnum
    team_image: string,
    actions?: any,
}

export type UtilityStatsResponse = {
    total_utilities: number,
    total_utilities_t: number,
    total_utilities_ct: number,
    total_utilities_any: number,
}

export type SingleUtilityResponse = {
    type: UtilityEnum,
    title: string,
    video:
        {
            path: string,
        },
    team_image: string,
    mapId: number,
    team_type:TeamEnum,
    movement:MovementEnum,
    technique:TechniqueEnum,
    image: {
        path: string,
    }
    key:string,
    created_at: string,
    updated_at: string,
    coords: Coords,
}

export type UtilityForm = {
    id: string,
    grenade_name: string,
    utility_type_id: string,
    team_type_id: string,
    technique_type: TechniqueEnum,
    movement_type: MovementEnum,
    key_type: KeyEnum,
    title_from: string,
    title_to: string,
    start_coords: Coords,
    end_coords: Coords,
    existing_start_coords: ExistingCoords,
    existing_end_coords: ExistingCoords,
    image_lineup: File[],
    video_lineup: File[],
}

export type UtilityFormErrors = {
    UtilityForm: UtilityForm
    errors: Record<string, string[]>
}

export type SimilarUtilityResponse = {
    attachments: Record<string, Attachment>,
    grenade_name: string,
    utility_name: string,
    id: number,
    map_image: string,
    map_name: string,
    team_image: string,
    team: string
}

export type BackendMapOverview = {
    map: MapResponse
    maps: MapResponse[],
    utilities: {
        count: Nade[],
        countByTeam: Team[],
        data: UtilityTable[],
    }
}

type Attachment = {
    path: string,
    filename: string,
}
