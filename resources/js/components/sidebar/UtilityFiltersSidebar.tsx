import React from "react";
import {Flame, MapIcon, RotateCcw, Users} from "lucide-react";

export type FilterOption = {
    value: string;
    label: string;
    image?: string;
    count: number;
};

export type UtilityFilters = {
    map: string | null;
    type: string | null;
    team: string | null;
};

type Props = {
    total: number;
    countLabel?: string;
    maps: FilterOption[];
    types: FilterOption[];
    teams: FilterOption[];
    filters: UtilityFilters;
    onChange: (filters: UtilityFilters) => void;
};

export default function UtilityFiltersSidebar({total, countLabel = "saved lineups", maps, types, teams, filters, onChange}: Props) {
    const hasFilters = filters.map !== null || filters.type !== null || filters.team !== null;

    const toggle = (key: keyof UtilityFilters, value: string) => {
        onChange({...filters, [key]: filters[key] === value ? null : value});
    };

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Filters</h2>
                    <p className="text-sm text-zinc-400">{total} {countLabel}</p>
                </div>
                {hasFilters && (
                    <button
                        onClick={() => onChange({map: null, type: null, team: null})}
                        className="flex cursor-pointer items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-orange-400"
                    >
                        <RotateCcw className="h-4 w-4"/>
                        Reset
                    </button>
                )}
            </div>

            <FilterSection title="Maps" icon={<MapIcon size={18}/>} options={maps} selected={filters.map}
                           onSelect={(value) => toggle("map", value)}/>
            <FilterSection title="Utilities" icon={<Flame size={18}/>} options={types} selected={filters.type}
                           onSelect={(value) => toggle("type", value)}/>
            <FilterSection title="Teams" icon={<Users size={18}/>} options={teams} selected={filters.team}
                           onSelect={(value) => toggle("team", value)}/>
        </div>
    );
}

function FilterSection({title, icon, options, selected, onSelect}: {
    title: string;
    icon: React.ReactNode;
    options: FilterOption[];
    selected: string | null;
    onSelect: (value: string) => void;
}) {
    if (options.length === 0) return null;

    return (
        <div className="mb-8 last:mb-0">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                {icon}
                {title}
            </h3>

            <div className="space-y-2">
                {options.map((option) => {
                    const isActive = selected === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => onSelect(option.value)}
                            className={`flex h-11 w-full cursor-pointer items-center rounded-xl border px-3 text-sm font-medium transition-all ${
                                isActive
                                    ? "border-orange-500 bg-orange-500 text-black hover:bg-orange-400"
                                    : "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-orange-500 hover:bg-zinc-800"
                            }`}
                        >
                            {option.image && <img src={option.image} alt={option.label} className="mr-3 h-6 w-6 object-contain"/>}
                            <span>{option.label}</span>
                            <span className={`ml-auto rounded-md px-2 py-0.5 text-xs ${isActive ? "bg-black/20" : "bg-zinc-700/60 text-zinc-400"}`}>
                                {option.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
