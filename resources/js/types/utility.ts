import {Coords, ExistingCoords} from "@/types/coords";
import {Movement, Technique, Utility, Team, Key} from "@/types/utils";

export type UtilityType = {
    id: string,
    name: string,
    image: string,
}

export type UtilityTable = {
    id: string
    grenade_name: string
    team_type: Team
    utility_type: Utility,
    utility_image: string,
    start_coords: Coords,
    end_coords: Coords,
    technique_type: Technique
    movement_type: Movement
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
    type: Utility,
    title: string,
    video:
        {
            path: string,
        },
    team_image: string,
    mapId: number,
    team_type:Team,
    movement:Movement,
    technique:Technique,
    image: {
        path: string,
    }
    key:string,
    created_at: string,
    updated_at: string,
    coords: Coords,
}

export interface UtilityResponse {
    data: UtilityTable[],
    total_utilities: number,
    total_utilities_t: number,
    total_utilities_ct: number,
}

export type UtilityForm = {
    id: string,
    grenade_name: string,
    utility_type_id: string,
    team_type_id: string,
    technique_type: Technique,
    movement_type: Movement,
    key_type: Key,
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

type Attachment = {
    path: string,
    filename: string,
}
