export type UtilityTable = {
    id: string
    grenade_name: string
    team_type: string
    utility_type: string,
    utility_image: string,
    start_coords_x: number,
    start_coords_y: number,
    start_coords_title_from: string,
    end_coords_x: number,
    end_coords_y: number,
    end_coords_title_to: string,
    technique_type: string
    movement_type: string
    team_image: string,
    actions?: any,
}

export type UtilityStatsResponse = {
    total_utilities: number,
    total_utilities_t: number,
    total_utilities_ct: number,
    total_utilities_any: number,
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
    technique_type: string,
    movement_type: string,
    key_type: string,
    title_from: string,
    title_to: string,
    id_existing_start_coords: string,
    id_existing_end_coords: string,
    start_coords_x: number,
    start_coords_y: number,
    start_coords_title_from: string,
    existing_start_coords_x: number,
    existing_start_coords_y: number,
    end_coords_x: number,
    end_coords_y: number,
    end_coords_title_to: string,
    existing_end_coords_x: number,
    existing_end_coords_y: number,
    image_lineup: File[],
    video_lineup: File[],
}

export type UtilityFormErrors = {
    UtilityForm: UtilityForm
    errors: Record<string, string[]>
}
