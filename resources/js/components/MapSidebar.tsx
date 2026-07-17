import { Button } from "@/components/ui/button";
import { BoxesIcon, Flame, MapIcon, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { MapOverviewResponse } from "@/types/map";

type Props = {
    info: MapOverviewResponse;
    onGrenadeTypeChange: (type: string) => void;
    onTeamTypeChange: (type: number) => void;
    grenadeType: string;
    teamType: number;
};

export default function MapSidebar({
                                       info,
                                       onGrenadeTypeChange,
                                       onTeamTypeChange,
                                       grenadeType,
                                       teamType,
                                   }: Props) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl">

            {/* HEADER */}

            <div className="mb-8 flex items-center gap-4">

                <img
                    src={info?.map?.image}
                    alt={info?.map?.name}
                    className="h-14 w-14 object-contain"
                />

                <div>

                    <h2 className="text-2xl font-bold text-white">
                        {info?.map?.name}
                    </h2>

                    <p className="text-sm text-zinc-400">
                        Browse lineups
                    </p>

                </div>

            </div>

            {/* NADES */}

            <SidebarSection
                title="Utilities"
                icon={<Flame size={18} />}
            >

                {info?.utilities?.nades.map((utility) => (

                    <Button
                        key={utility.id}
                        variant="ghost"
                        onClick={() => onGrenadeTypeChange(utility.name)}
                        className={`
                            mb-2
                            h-11
                            w-full
                            justify-start
                            rounded-xl
                            border
                            transition-all

                            ${
                            grenadeType === utility.name
                                ? "border-orange-500 bg-orange-500 text-black hover:bg-orange-400"
                                : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-orange-500 hover:bg-zinc-800"
                        }
                        `}
                    >
                        <img
                            src={utility.image}
                            alt={utility.name}
                            className="mr-3 h-6 w-6"
                        />

                        {utility.name}
                    </Button>

                ))}

                <Button
                    variant="ghost"
                    onClick={() => onGrenadeTypeChange("ANY")}
                    className={`
                        mt-2
                        h-11
                        w-full
                        justify-start
                        rounded-xl
                        border

                        ${
                        grenadeType === "ANY"
                            ? "border-orange-500 bg-orange-500 text-black hover:bg-orange-400"
                            : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-orange-500 hover:bg-zinc-800"
                    }
                    `}
                >
                    <BoxesIcon className="mr-3 h-5 w-5" />

                    Any Utility
                </Button>

            </SidebarSection>

            {/* TEAMS */}

            <SidebarSection
                title="Teams"
                icon={<Users size={18} />}
            >

                <div className="grid grid-cols-2 gap-3">

                    {info?.teams?.map((team) => (

                        <Button
                            key={team.id}
                            variant="ghost"
                            onClick={() => onTeamTypeChange(Number(team.id))}
                            className={`
                                h-12
                                rounded-xl
                                border

                                ${
                                teamType === Number(team.id)
                                    ? "border-orange-500 bg-orange-500 text-black hover:bg-orange-400"
                                    : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-orange-500 hover:bg-zinc-800"
                            }
                            `}
                        >
                            <img
                                src={team.image}
                                alt={team.name}
                                className="mr-2 h-6 w-6"
                            />

                            {team.name}

                        </Button>

                    ))}

                </div>

            </SidebarSection>

            {/* MAPS */}

            <SidebarSection
                title="Maps"
                icon={<MapIcon size={18} />}
            >

                {info?.maps?.map((map) => (

                    <Button
                        key={map.id}
                        variant="ghost"
                        onClick={() =>
                            navigate({
                                to: "/maps/$mapName",
                                params: {
                                    mapName: map.name.toLowerCase(),
                                },
                            })
                        }
                        className={`
                            mb-2
                            h-11
                            w-full
                            justify-start
                            rounded-xl
                            border

                            ${
                            map.name === info?.map?.name
                                ? "border-orange-500 bg-orange-500 text-black hover:bg-orange-400"
                                : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-orange-500 hover:bg-zinc-800"
                        }
                        `}
                    >
                        <img
                            src={map.image}
                            alt={map.name}
                            className="mr-3 h-6 w-6"
                        />

                        {map.name}

                    </Button>

                ))}

            </SidebarSection>

        </div>
    );
}

function SidebarSection({
                            title,
                            icon,
                            children,
                        }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-8">

            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">

                {icon}

                {title}

            </div>

            {children}

        </div>
    );
}
