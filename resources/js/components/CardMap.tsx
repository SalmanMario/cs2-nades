import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useQueryApi} from "@/hooks/use-query";

export default function CardMap({onCardClick}: { onCardClick: (mapName: string) => void}) {
    const {data : maps, isLoading, error} = useQueryApi<{data: MapResponse[]}>({
        queryKey: ['maps'],
        method: 'GET',
        url: `/getMaps`,
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-12 gap-10">
                {maps.data.map((map: MapResponse) => (
                    <div key={map.id} className="col-span-12 md:col-span-6 lg:col-span-3">
                        <Card className="cursor-pointer hover:scale-110 border-gray-300 transition-transform duration-200"
                              onClick={() => onCardClick(map.name.toLowerCase())}
                        >
                            <img
                                src={map.image}
                                alt={map.name}
                                className="object-cover"
                            />

                            <CardHeader className="text-center text-4xl">
                                <CardTitle className="mb-5">{map.name}</CardTitle>
                                <CardDescription className="text-lg">
                                    Utilities: {map.number_of_utilities}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )

}
