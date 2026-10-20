import {createFileRoute, useNavigate} from '@tanstack/react-router'
import React, {useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {Search, Star} from "lucide-react";
import api from "@/lib/api";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";
import Footer from "@/components/footer/Footer";
import FavoritesSidebar, {FavoriteFilters, FilterOption} from "@/components/sidebar/FavoritesSidebar";
import FavoriteUtilityCard from "@/components/card/FavoriteUtilityCard";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {FavoriteUtilityResponse} from "@/types/utility";
import {pageTitle} from "@/hooks/helper";

export const Route = createFileRoute('/my-favorites/')({
    head: () => ({
        meta: [{title: pageTitle("My Favorites")}],
    }),
    component: RouteComponent,
})

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
    favorites: FavoriteUtilityResponse[],
    getValue: (utility: FavoriteUtilityResponse) => string,
    getImage: (utility: FavoriteUtilityResponse) => string,
    getLabel: (value: string) => string = (value) => value,
): FilterOption[] {
    const options = new Map<string, FilterOption>();
    favorites.forEach((utility) => {
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

function RouteComponent() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FavoriteFilters>({map: null, type: null, team: null});
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("recent");

    // null = user is not logged in
    const {data: favorites, isLoading} = useQuery<FavoriteUtilityResponse[] | null>({
        queryKey: ['favorites'],
        queryFn: async () => {
            try {
                const response = await api.get<FavoriteUtilityResponse[]>("/favorites");
                return response.data;
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 401) return null;
                throw error;
            }
        },
        retry: false,
    });

    const allFavorites = favorites ?? [];

    const mapOptions = useMemo(() => buildOptions(allFavorites, (u) => u.map_name, (u) => u.map_image), [favorites]);
    const typeOptions = useMemo(() => buildOptions(allFavorites, (u) => u.utility_type, (u) => u.utility_image), [favorites]);
    const teamOptions = useMemo(() => buildOptions(allFavorites, (u) => u.team, (u) => u.team_image, (v) => TEAM_LABELS[v] ?? v), [favorites]);

    const visibleFavorites = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = allFavorites.filter((utility) =>
            (filters.map === null || utility.map_name === filters.map) &&
            (filters.type === null || utility.utility_type === filters.type) &&
            (filters.team === null || utility.team === filters.team) &&
            (query === "" || `${utility.title} ${utility.grenade_name} ${utility.map_name}`.toLowerCase().includes(query))
        );

        if (sort === "map") return [...filtered].sort((a, b) => a.map_name.localeCompare(b.map_name));
        if (sort === "type") return [...filtered].sort((a, b) => a.utility_type.localeCompare(b.utility_type));
        return filtered;
    }, [favorites, filters, search, sort]);

    const openUtility = (utility: FavoriteUtilityResponse) => {
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

        if (favorites === null) {
            return (
                <EmptyState
                    title="Log in to see your favorites"
                    text="Save lineups with the star button and find them all here."
                    action={<Button onClick={() => navigate({to: "/login"})} className="mt-6 rounded-xl bg-orange-500 text-black hover:bg-orange-400">Login</Button>}
                />
            );
        }

        if (allFavorites.length === 0) {
            return (
                <EmptyState
                    title="No favorites yet"
                    text="Open a map, pick a lineup and press the star to save it here."
                    action={<Button onClick={() => navigate({to: "/"})} className="mt-6 rounded-xl bg-orange-500 text-black hover:bg-orange-400">Browse maps</Button>}
                />
            );
        }

        if (visibleFavorites.length === 0) {
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
                {visibleFavorites.map((utility) => (
                    <FavoriteUtilityCard key={utility.id} utility={utility} onClick={() => openUtility(utility)}/>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#0d0f14]">
            <FrontendNavbar/>

            <div className="flex-1">
                <div className="mx-auto max-w-[1920px] px-8 py-8">
                    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <aside className="hidden lg:block">
                            <div className="sticky top-24">
                                <FavoritesSidebar
                                    total={allFavorites.length}
                                    maps={mapOptions}
                                    types={typeOptions}
                                    teams={teamOptions}
                                    filters={filters}
                                    onChange={setFilters}
                                />
                            </div>
                        </aside>

                        <section className="min-w-0">
                            <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
                                <div className="flex flex-wrap items-center gap-5">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
                                        <Star className="h-8 w-8" fill="currentColor"/>
                                    </div>
                                    <div>
                                        <h1 className="text-5xl font-bold text-white">My Favorites</h1>
                                        <p className="mt-2 text-zinc-400">
                                            {favorites ? `${visibleFavorites.length} of ${allFavorites.length} lineups` : "Your saved lineups"}
                                        </p>
                                    </div>
                                </div>

                                {!!favorites?.length && (
                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <InputGroup className="max-w-xl flex-1 rounded-xl border border-zinc-700 bg-zinc-900/80">
                                            <InputGroupInput
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search your favorites"
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

function EmptyState({title, text, action}: {title: string, text: string, action?: React.ReactNode}) {
    return (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-20 text-center">
            <Star className="h-12 w-12 text-zinc-700"/>
            <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-md text-zinc-400">{text}</p>
            {action}
        </div>
    );
}
