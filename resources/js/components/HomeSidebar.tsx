import {
    Bomb,
    Map,
    Star,
} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";

export default function HomeSidebar({maps, nadeTypes}: { maps?: MapResponse[]; nadeTypes?: { nades: Nade[] } }) {
    const navigate = useNavigate();

    const goToMaps = (map: string) => {
        navigate({
            to: "/maps/$mapName",
            params: {
                mapName: map
            }
        }).then()
    }

    return (
        <div className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                    <Map size={18}/>
                    Maps
                </h3>

                <div className="space-y-2">
                    {maps?.map((map) => (
                        <button
                            onClick={() => goToMaps(map.name)}
                            key={map.id}
                            className="flex cursor-pointer w-full items-center rounded-lg py-2 text-left text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >
                            <img className="w-7 h-7" src={map.image} alt={map.name}/>
                            <span className="ms-5">{map.name}</span>
                        </button>
                    ))}
                </div>

            </div>

            <div>

                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                    <Bomb size={18}/>
                    Utilities
                </h3>

                <div className="space-y-2">

                    {nadeTypes?.nades?.map((nade: Nade) => (
                        <button
                            key={nade.id}
                            className="flex cursor-pointer w-full items-center rounded-lg py-2 text-left text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >
                            <img className="w-7 h-7" src={nade.image}/>
                            <p className="ms-3">{nade.name}</p>
                        </button>
                    ))}
                </div>

            </div>

            <div>

                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                    <Star size={18}/>
                    Favorites
                </h3>

                <div className="text-sm text-zinc-500">
                    No favorites.
                </div>

            </div>

        </div>
    );
}
