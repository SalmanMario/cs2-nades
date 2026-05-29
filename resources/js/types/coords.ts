export interface Coords {
    x: number
    y: number
    title: string
    team_id: number
}

export interface ExistingCoords extends Coords {
    id: number
}
