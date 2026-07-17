import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";
import StatCard from "@/components/StatCard";
import DialogSearch from "@/components/DialogSearch";
import {LayoutResponse} from "@/types/map";

export default function FrontendHeader({info, setShowSearchDialog, showSearchDialog}: {
    info?: LayoutResponse;
    setShowSearchDialog: (value: boolean) => void;
    showSearchDialog: boolean;
}) {
    return (
        <div className="relative overflow-hidden border-b border-white/10">
            {/* Background blur */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
            <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

            <div className="relative mx-auto  px-6 py-16">

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-5xl font-extrabold tracking-tight">
                        <span className="text-orange-400">CS2</span>{" "}
                        <span className="text-white">Nades</span>
                    </h1>

                    <p className="max-w-2xl text-lg text-zinc-400">
                        Master every smoke, flash, molotov & HE lineup for every competitive map.
                    </p>
                </div>

                {/* Search */}
                <div className="mt-8 max-w-3xl">
                    <InputGroup
                        onClick={() => setShowSearchDialog(true)}
                        className="h-14 cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900/80 backdrop-blur"
                    >
                        <InputGroupInput
                            readOnly
                            placeholder="Search maps, smokes, flashes..."
                            className="cursor-pointer border-0 bg-transparent text-base placeholder:text-zinc-500 focus-visible:ring-0"
                        />

                        <InputGroupAddon className="border-l border-zinc-700 px-5">
                            <Search className="h-5 w-5 text-zinc-400" />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

                    <StatCard
                        label="Maps"
                        value={info?.maps_count ?? 0}
                        color="text-white"
                    />

                    <StatCard
                        label="Lineups"
                        value={info?.lineups ?? 0}
                        color="text-white"
                    />

                    {info?.utilities?.nades?.map((nade: Nade) => (
                        <StatCard
                            key={nade.name}
                            label={nade.name}
                            value={nade.count ?? 0}
                            image={nade.image}
                        />
                    ))}

                </div>

            </div>
            <DialogSearch setShowSearchDialog={setShowSearchDialog} showSearchDialog={showSearchDialog}/>
        </div>
    )
}
