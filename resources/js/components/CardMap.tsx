import {useQuery} from "@tanstack/react-query";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useNavigate} from "@tanstack/react-router";

export default function CardMap({onCardClick}: { onCardClick: (mapName: string) => void}) {
    const navigate = useNavigate();
    const {isPending, error, data} = useQuery({
        queryKey: ['maps'],
        queryFn: async () => await fetch('/getMaps')
            .then(res => res.json())
    })

    if (isPending) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-12 gap-10">
                {data?.data.map((map: MapResponse) => (
                    <div key={map.id} className="col-span-12 md:col-span-6 lg:col-span-3">
                        <Card className="cursor-pointer hover:scale-110 border-gray-300 transition-transform duration-200"
                              onClick={() => onCardClick(map.name.toLowerCase())}
                        >
                            <img
                                src={`/storage/${map.image}`}
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
