import {useRef} from "react";
import {Footprints, LightbulbIcon, Play} from "lucide-react";
import {FavoriteUtilityResponse} from "@/types/utility";
import FavoriteButton from "@/components/button/FavoriteButton";
import {firstToUpperCase} from "@/hooks/helper";

function formatEnum(value?: string) {
    if (!value) return "-";
    return value.split("_").map((part) => firstToUpperCase(part.toLowerCase())).join(" ");
}

type Props = {
    utility: FavoriteUtilityResponse;
    onClick: () => void;
};

export default function FavoriteUtilityCard({utility, onClick}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isT = utility.team === "T";

    // Video only plays while hovering, so a page full of cards stays light
    const playPreview = () => {
        videoRef.current?.play().catch(() => {});
    };

    const stopPreview = () => {
        if (!videoRef.current) return;
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={playPreview}
            onMouseLeave={stopPreview}
            className={`group cursor-pointer overflow-hidden rounded-2xl border bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isT ? "border-zinc-800 hover:border-orange-500/60 hover:shadow-orange-500/10" : "border-zinc-800 hover:border-blue-500/60 hover:shadow-blue-500/10"
            }`}
        >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
                {utility.image && (
                    <img src={utility.image} alt={utility.title} className="absolute inset-0 h-full w-full object-cover"/>
                )}
                {utility.video && (
                    <video
                        ref={videoRef}
                        src={utility.video}
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                )}
                {!utility.image && !utility.video && (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-500">No preview</div>
                )}

                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                    <img src={utility.utility_image} alt={utility.utility_type} className="h-4 w-4"/>
                    {formatEnum(utility.utility_type)}
                </div>

                <div className="absolute right-2 top-2 rounded-lg bg-black/70 backdrop-blur" onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton utilityId={utility.id}/>
                </div>

                {utility.video && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/70 p-1.5 text-white transition-opacity group-hover:opacity-0">
                        <Play className="h-3.5 w-3.5" fill="currentColor"/>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="line-clamp-2 min-h-[3rem] font-semibold leading-snug text-white">
                    {utility.title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                        <LightbulbIcon className="h-3.5 w-3.5"/>
                        {formatEnum(utility.technique)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Footprints className="h-3.5 w-3.5"/>
                        {formatEnum(utility.movement)}
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3 text-sm">
                    <span className="flex items-center gap-2 text-zinc-300">
                        <img src={utility.map_image} alt={utility.map_name} className="h-6 w-6 object-contain"/>
                        {utility.map_name}
                    </span>
                    <span className={`flex items-center gap-2 font-medium ${isT ? "text-orange-400" : "text-blue-400"}`}>
                        {utility.team}
                        <img src={utility.team_image} alt={utility.team} className="h-6 w-6"/>
                    </span>
                </div>
            </div>
        </div>
    );
}
