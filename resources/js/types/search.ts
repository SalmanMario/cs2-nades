type SearchCardImage = {
    id: number,
    path: string,
    order: number,
}

type SearchResult = {
    id: number,
    grenade_name: string,
    team_image: string,
    team_name: string,
    map_name: string,
    map_image: string,
    utility_name: string,
    utility_image: string,
    movement_type: string,
    card_image: SearchCardImage[],
}
