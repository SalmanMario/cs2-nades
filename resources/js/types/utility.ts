import {Coords, ExistingCoords} from "@/types/coords";
import {MovementEnum, TechniqueEnum, UtilityEnum, TeamEnum, KeyEnum, ReportReasonEnum} from "@/types/enums";
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
    }[],
    key:string,
    notes: string | null,
    // has open reports from players
    is_flagged: boolean,
    reported_by_me: boolean,
    freshness: "new" | "updated" | null,
    created_at: string,
    updated_at: string,
    coords: Coords,
}

export type UtilityFormType = {
    id: string,
    grenade_name: string,
    utility_type_id: string,
    team_type_id: string,
    technique_type: TechniqueEnum,
    movement_type: MovementEnum,
    key_type: KeyEnum,
    notes: string | null,
    is_popular: boolean,
    mark_as_updated: boolean,
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
    UtilityForm: UtilityFormType
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

export type UtilityCardResponse = {
    id: number,
    title: string,
    grenade_name: string,
    utility_type: UtilityEnum,
    utility_image: string,
    team: TeamEnum,
    team_image: string,
    map_name: string,
    map_image: string,
    technique: TechniqueEnum,
    movement: MovementEnum,
    image: string | null,
    video: string | null,
    // only on My Favorites
    favorited_at?: string,
    favorites_count?: number,
    // badge for lineups created or marked as updated in the last 14 days
    freshness: "new" | "updated" | null,
    // has open reports from players, shown until the lineup is updated or the reports are dismissed
    is_flagged: boolean,
    created_at: string,
    content_updated_at: string | null,
}

export type FlaggedUtilityResponse = {
    id: number,
    title: string,
    grenade_name: string,
    utility_type: UtilityEnum,
    utility_image: string,
    team: TeamEnum,
    team_image: string,
    map_name: string,
    map_image: string,
    reports: {
        id: number,
        reason: ReportReasonEnum,
        message: string | null,
        user_name: string | null,
        created_at: string,
    }[],
}

export const REPORT_REASON_LABELS: Record<ReportReasonEnum, string> = {
    OUTDATED: "Outdated after a map update",
    WRONG_NAME: "Wrong name or position",
    WRONG_LINEUP: "Lineup doesn't land",
    BROKEN_MEDIA: "Broken video or images",
    OTHER: "Something else",
};
