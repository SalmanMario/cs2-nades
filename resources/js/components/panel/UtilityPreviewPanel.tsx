import {useNavigate} from "@tanstack/react-router";
import {ArrowRight, Footprints, Keyboard, LightbulbIcon, X} from "lucide-react";
import {useQueryApi} from "@/hooks/use-query";
import {SingleUtilityResponse} from "@/types/utility";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {firstToUpperCase} from "@/hooks/helper";
import FavoriteButton from "@/components/button/FavoriteButton";

type Props = {
    mapName: string;
    utilityId: number;
    onClose: () => void;
};

function formatEnum(value?: string) {
    if (!value) return "-";
    return value.split("_").map((part) => firstToUpperCase(part.toLowerCase())).join(" ");
}

export default function UtilityPreviewPanel({mapName, utilityId, onClose}: Props) {
    const navigate = useNavigate();

    // Same query key as the utility detail page, so opening it afterwards is instant
    const {data: utility, isLoading} = useQueryApi<SingleUtilityResponse>({
        queryKey: ['utility', String(utilityId)],
        method: 'GET',
        url: `/getUtility/${mapName}/${utilityId}`,
    })

    const openUtility = () => {
        navigate({
            to: "/maps/$mapName/$utilityId",
            params: {
                mapName,
                utilityId: String(utilityId)
            }
        }).then()
    }

    if (isLoading || !utility) {
        return (
            <div className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl"/>
                <Skeleton className="h-6 w-3/4"/>
                <Skeleton className="h-4 w-1/2"/>
                <Skeleton className="h-4 w-2/3"/>
            </div>
        )
    }

    const fallbackImage = utility.image?.[0]?.path;
    const isT = utility.team_type === "T";

    return (
        <div>
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                        {formatEnum(utility.type)}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold leading-snug text-white">
                        {utility.title}
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <FavoriteButton utilityId={utilityId}/>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                        aria-label="Close preview"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                </div>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-black">
                {utility.video?.path ? (
                    <video
                        key={utility.video.path}
                        className="h-full w-full object-cover"
                        src={utility.video.path}
                        poster={fallbackImage}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                    />
                ) : fallbackImage ? (
                    <img src={fallbackImage} alt={utility.title} className="h-full w-full object-cover"/>
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        No preview available
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Thrown by</span>
                    <span className={`flex items-center gap-2 font-medium ${isT ? "text-orange-400" : "text-blue-400"}`}>
                        <img src={utility.team_image} className="h-6 w-6" alt={utility.team_type}/>
                        {isT ? "Terrorist" : utility.team_type === "CT" ? "Counter-Terrorist" : "Any side"}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Technique</span>
                    <span className="flex items-center gap-2 text-white">
                        <LightbulbIcon className="h-4 w-4 text-zinc-400"/>
                        {formatEnum(utility.technique)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Movement</span>
                    <span className="flex items-center gap-2 text-white">
                        <Footprints className="h-4 w-4 text-zinc-400"/>
                        {formatEnum(utility.movement)}
                    </span>
                </div>
                {utility.key && (
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Key</span>
                        <span className="flex items-center gap-2 text-white">
                            <Keyboard className="h-4 w-4 text-zinc-400"/>
                            {formatEnum(utility.key)}
                        </span>
                    </div>
                )}
            </div>

            <Button
                onClick={openUtility}
                className="mt-5 w-full rounded-xl bg-orange-500 text-black hover:bg-orange-400"
            >
                View full lineup
                <ArrowRight/>
            </Button>
        </div>
    )
}
