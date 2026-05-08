export type UtilityTable = {
    id: string
    grenade_name: string
    team_type: string
    utility_type: string,
    start_coords_x: number,
    start_coords_y: number,
    start_coords_title_from: string,
    end_coords_x: number,
    end_coords_y: number,
    end_coords_title_to: string,
    technique_type: string
    movement_type: string
    actions?: any,
}

export type UtilityForm = {
    id: string,
    grenade_name: string,
    utility_type_id: string,
    team_type_id: string,
    technique_type: string,
    movement_type: string,
    title_from: string,
    title_to: string,
    start_coords_x: string,
    start_coords_y: string,
    start_coords_title_from: string,
    existing_start_coords_x: string,
    existing_start_coords_y: string,
    end_coords_x: string,
    end_coords_y: string,
    end_coords_title_to: string,
    existing_end_coords_x: string,
    existing_end_coords_y: string,
    image_lineup: File[],
    video_lineup: File[],
}

export type UtilityFormErrors = {
    UtilityForm: UtilityForm
    errors: Record<string, string[]>
}
