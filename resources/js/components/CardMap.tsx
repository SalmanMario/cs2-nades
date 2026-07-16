import {Card} from "@/components/ui/card";
import {useQueryApi} from "@/hooks/use-query";
import {ArrowRight} from "lucide-react";

export default function CardMap({onCardClick}: { onCardClick: (mapName: string) => void; }) {
    const {data: maps, isLoading, error} = useQueryApi<MapOverview>({
        queryKey: ["mapsOverview"],
        method: "GET",
        url: "/mapsOverview",
    });

    if (isLoading) {
        return (
            <div className="py-20 text-center text-zinc-400">
                Loading maps...
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 text-center text-red-500">
                Error: {error.message}
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {maps?.maps?.map((map) => {
                    const mapNades = maps?.nade_count?.find((nc) => nc.map_id === map.id)?.nades ?? [];
                    return (
                        <Card
                            key={map.id}
                            onClick={() => onCardClick(map.name.toLowerCase())}
                            className="
                            group
                            relative
                            h-[425px]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900
                            cursor-pointer
                            transition-all
                            duration-300
                            hover:-translate-y-2
                            hover:border-orange-500/40
                            hover:shadow-2xl
                            hover:shadow-orange-500/10
                        "
                        >
                            {/* Background */}
                            <img
                                src={map.map_card_image}
                                alt={map.name}
                                className="
                               absolute
                                    inset-0
                                    h-full
                                    w-full
                                    object-cover
                                    transition-all
                                    duration-500
                                    ease-out
                                    group-hover:scale-110
                                    brightness-75
                                    group-hover:brightness-100
                            "
                            />

                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"/>
                            {map.name === "Mirage" ? <div
                                className="absolute right-5 top-5 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                MOST POPULAR
                            </div> : ''}
                            {/* Logo */}
                            {map.image && (
                                <img
                                    src={map.image}
                                    alt={`${map.name} logo`}
                                    className="
                                    absolute
                                    left-5
                                    top-5
                                    h-25
                                    w-25
                                    object-contain
                                    drop-shadow-xl
                                "
                                />
                            )}

                            {/* Bottom Content */}
                            <div className="absolute bottom-0 w-full p-6">

                                <h2 className="text-4xl font-bold text-white">
                                    {map.name}
                                </h2>

                                <p className="mt-1 text-zinc-300">
                                    {map.number_of_utilities} Lineups
                                </p>

                                {/* Utilities */}
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {mapNades.map((nade) => (
                                        <div
                                            key={nade.name}
                                            className="
                            flex items-center gap-2
                            rounded-full
                            border border-white/10
                            bg-black/30
                            px-3 py-2
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            group-hover:border-orange-500/30
                        "
                                        >
                                            <img
                                                src={nade.image}
                                                alt={nade.name}
                                                className="h-5 w-5 object-contain"
                                            />
                                            <span className="text-sm font-semibold text-white">
                            {nade.count}
                        </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Button */}
                                <div
                                    className="
                                    mt-6
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-black/40
                                    py-3
                                    text-white
                                    backdrop-blur-md
                                    transition-all
                                    duration-300
                                    group-hover:border-orange-500
                                    group-hover:bg-orange-500
                                    group-hover:text-black
                                "
                                >
                                <span className="font-medium">
                                    View Lineups
                                </span>

                                    <ArrowRight size={18}/>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </>
    );
}
