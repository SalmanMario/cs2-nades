import React, {useMemo, useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Search, SlidersHorizontal, Star} from "lucide-react";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";
import Footer from "@/components/footer/Footer";
import UtilityFiltersSidebar, {UtilityFilters, FilterOption} from "@/components/sidebar/UtilityFiltersSidebar";
import UtilityCard from "@/components/card/UtilityCard";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {UtilityCardResponse} from "@/types/utility";

type SortOption = "recent" | "map" | "type";

const SORT_LABELS: Record<SortOption, string> = {
    recent: "Recently added",
    map: "Map",
    type: "Utility type",
};

const TEAM_LABELS: Record<string, string> = {
    T: "Terrorist",
    CT: "Counter-Terrorist",
    ANY: "Any side",
};

function buildOptions(
    utilities: UtilityCardResponse[],
    getValue: (utility: UtilityCardResponse) => string,
    getImage: (utility: UtilityCardResponse) => string,
    getLabel: (value: string) => string = (value) => value,
): FilterOption[] {
    const options = new Map<string, FilterOption>();
    utilities.forEach((utility) => {
        const value = getValue(utility);
        const existing = options.get(value);
        if (existing) {
            existing.count++;
        } else {
            options.set(value, {value, label: getLabel(value), image: getImage(utility), count: 1});
        }
    });
    return [...options.values()].sort((a, b) => a.label.localeCompare(b.label));
}

type Props = {
    title: string,
    icon: React.ReactNode,
    // shown under the title before anything is loaded or when the list is unavailable
    description: string,
    // e.g. "saved lineups", shown in the sidebar
    countLabel: string,
    utilities: UtilityCardResponse[] | null | undefined,
    isLoading: boolean,
    // shown when there are no utilities at all
    emptyState: React.ReactNode,
}

// Searchable, filterable grid of utility cards (My Favorites, Popular)
export default function UtilityCollection({title, icon, description, countLabel, utilities, isLoading, emptyState}: Props) {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<UtilityFilters>({map: null, type: null, team: null});
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("recent");

    const allUtilities = utilities ?? [];

    const mapOptions = useMemo(() => buildOptions(allUtilities, (u) => u.map_name, (u) => u.map_image), [utilities]);
    const typeOptions = useMemo(() => buildOptions(allUtilities, (u) => u.utility_type, (u) => u.utility_image), [utilities]);
    const teamOptions = useMemo(() => buildOptions(allUtilities, (u) => u.team, (u) => u.team_image, (v) => TEAM_LABELS[v] ?? v), [utilities]);

    const visibleUtilities = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = allUtilities.filter((utility) =>
            (filters.map === null || utility.map_name === filters.map) &&
            (filters.type === null || utility.utility_type === filters.type) &&
            (filters.team === null || utility.team === filters.team) &&
            (query === "" || `${utility.title} ${utility.grenade_name} ${utility.map_name}`.toLowerCase().includes(query))
        );

        if (sort === "map") return [...filtered].sort((a, b) => a.map_name.localeCompare(b.map_name));
        if (sort === "type") return [...filtered].sort((a, b) => a.utility_type.localeCompare(b.utility_type));
        return filtered;
    }, [utilities, filters, search, sort]);

    const activeFilters = Object.values(filters).filter((value) => value !== null).length;

    const sidebar = (
        <UtilityFiltersSidebar
            total={allUtilities.length}
            countLabel={countLabel}
            maps={mapOptions}
            types={typeOptions}
            teams={teamOptions}
            filters={filters}
            onChange={setFilters}
        />
    );

    const openUtility = (utility: UtilityCardResponse) => {
        navigate({
            to: "/maps/$mapName/$utilityId",
            params: {
                mapName: utility.map_name.toLowerCase(),
                utilityId: String(utility.id),
            }
        }).then()
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({length: 8}).map((_, index) => (
                        <Skeleton key={index} className="aspect-[4/4] w-full rounded-2xl"/>
                    ))}
                </div>
            );
        }

        if (allUtilities.length === 0) {
            return emptyState;
        }

        if (visibleUtilities.length === 0) {
            return (
                <EmptyState
                    title="No lineups match"
                    text="Try another filter or search term."
                    action={<Button variant="outline" onClick={() => {
                        setFilters({map: null, type: null, team: null});
                        setSearch("");
                    }} className="mt-6 rounded-xl">Clear filters</Button>}
                />
            );
        }

        return (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleUtilities.map((utility) => (
                    <UtilityCard key={utility.id} utility={utility} onClick={() => openUtility(utility)}/>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#0d0f14]">
            <FrontendNavbar/>

            <div className="flex-1">
                <div className="mx-auto max-w-[1920px] px-4 py-6 md:px-8 md:py-8">
                    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <aside className="hidden lg:block">
                            <div className="sticky top-24">
                                {sidebar}
                            </div>
                        </aside>

                        <section className="min-w-0">
                            <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 md:p-8">
                                <div className="flex flex-wrap items-center gap-5">
                                    {icon}
                                    <div>
                                        <h1 className="text-3xl font-bold text-white md:text-5xl">{title}</h1>
                                        <p className="mt-2 text-zinc-400">
                                            {utilities?.length ? `${visibleUtilities.length} of ${allUtilities.length} lineups` : description}
                                        </p>
                                    </div>
                                </div>

                                {!!utilities?.length && (
                                    <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8 md:gap-4">
                                        <InputGroup className="min-w-0 max-w-xl basis-full rounded-xl border border-zinc-700 bg-zinc-900/80 sm:basis-auto sm:flex-1">
                                            <InputGroupInput
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder={`Search ${title.toLowerCase()}`}
                                                className="border-0 bg-transparent text-base placeholder:text-zinc-500 focus-visible:ring-0"
                                            />
                                            <InputGroupAddon className="border-l border-zinc-700 px-5">
                                                <Search className="h-5 w-5 text-zinc-400"/>
                                            </InputGroupAddon>
                                        </InputGroup>

                                        <div className="flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/60 p-1">
                                            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setSort(option)}
                                                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                                        sort === option ? "bg-orange-500 text-black" : "text-zinc-300 hover:bg-zinc-700"
                                                    }`}
                                                >
                                                    {SORT_LABELS[option]}
                                                </button>
                                            ))}
                                        </div>

                                        {/* the sidebar is hidden below lg, so filters open in a sheet */}
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" className="rounded-xl lg:hidden">
                                                    <SlidersHorizontal/>
                                                    Filters
                                                    {activeFilters > 0 && (
                                                        <span className="rounded-full bg-orange-500 px-1.5 text-xs text-black">{activeFilters}</span>
                                                    )}
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="left" className="overflow-y-auto border-zinc-800 bg-[#0d0f14] p-0">
                                                <SheetTitle className="sr-only">Filters</SheetTitle>
                                                {sidebar}
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                )}
                            </div>

                            {renderContent()}
                        </section>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export function EmptyState({title, text, action}: {title: string, text: string, action?: React.ReactNode}) {
    return (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-20 text-center">
            <Star className="h-12 w-12 text-zinc-700"/>
            <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-md text-zinc-400">{text}</p>
            {action}
        </div>
    );
}
