type Nade = {
    id: string,
    name: string,
    image: string,
    count?: number,
}

type NadeCount = {
    map_id: string,
    name: string,
    nades: NadesInfo[]
}

type NadesInfo = {
    count: number,
    id: number,
    image: string,
    name: string,
}
