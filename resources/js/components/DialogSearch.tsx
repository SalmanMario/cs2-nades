import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, {useRef, useState, useCallback} from "react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";
import {useQueryApi} from "@/hooks/use-query";
import {Card} from "@/components/ui/card";
import {useNavigate} from "@tanstack/react-router";

type DialogSearchProps = {
    showSearchDialog: boolean;
    setShowSearchDialog: (showSearchDialog: boolean) => void;
    url?: string;
    params?: Record<string, string | number | undefined>;
};

export default function DialogSearch({showSearchDialog, setShowSearchDialog, url = "/search", params = {}}: DialogSearchProps) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const {data: results, isFetching} = useQueryApi<SearchResult[]>({
        queryKey: ['search', url, searchTerm, JSON.stringify(params)],
        url,
        method: 'GET',
        params: {q: searchTerm, ...params},
        enabled: searchTerm.trim().length > 0,
    });

    function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => func(...args), delay);
        };
    }

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
        }, 500),
        []
    );

    const navigateToGrenade = ($mapName: string, $utilityId: string) => {
        navigate({
            to: '/maps/$mapName/$utilityId',
            params: {
                mapName: $mapName,
                utilityId: $utilityId
            }
        }).then()
    }

    return (
        <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
            <DialogContent className="flex max-h-[85vh] max-w-7xl flex-col">
                <DialogHeader>
                    <DialogTitle>Search utilities</DialogTitle>
                    <DialogDescription>
                        <InputGroup className="ml-auto mr-5 mt-5">
                            <InputGroupInput
                                name="search"
                                id="search"
                                placeholder="Search nade..."
                                onChange={(e) => handleSearch(e.target.value)}
                                autoFocus
                            />
                            <InputGroupAddon>
                                <Search/>
                            </InputGroupAddon>
                        </InputGroup>
                    </DialogDescription>
                </DialogHeader>

                <div className="mx-4 no-scrollbar max-h-[75vh] overflow-y-auto px-4">
                    {isFetching && <p className="text-sm text-muted-foreground">Se caută...</p>}

                    {!isFetching && searchTerm && results?.length === 0 && (
                        <p className="text-sm text-muted-foreground">Niciun rezultat pentru "{searchTerm}"</p>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {results?.map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => navigateToGrenade(item.map_name, String(item.id))}
                                className="group cursor-pointer relative w-full overflow-hidden border-white/10 bg-[#101215] p-0 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-amber-500/10"
                            >
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <img
                                        src={item.card_image[1]?.path ?? item.map_image}
                                        alt={item.map_name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div
                                        className="absolute inset-0"/>
                                    <div
                                        className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                                        <img src={item.map_image} className="h-7 w-7 mr-2"/>
                                        <span className="text-[11px] font-medium uppercase tracking-wide text-white/90">
                                            {item.map_name}
                                        </span>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-4">
                                        <h3 className="text-lg font-bold leading-tight text-white [text-shadow:_0_1px_8px_rgb(0_0_0_/_60%)]">
                                            {item.grenade_name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 px-4 pb-2 pt-3">
                                    <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/30 bg-white/5 pl-1 pr-2.5">
                                        <img
                                            src={item.team_image}
                                            alt="Echipă"
                                            className="h-5 w-5 shrink-0 rounded-full object-cover"
                                        />
                                        <span className="truncate text-xs leading-none text-white">
                                            {item.team_name}
                                        </span>
                                    </div>
                                    <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/30 bg-white/5 pl-1 pr-2.5">
                                        <img
                                            src={item.utility_image}
                                            alt="Utilitar"
                                            className="h-5 w-5 shrink-0 rounded-full object-cover"
                                        />
                                        <span className="truncate text-xs leading-none text-white">
                                            {item.utility_name}
                                        </span>
                                    </div>
                                    <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/30 bg-white/5 pl-1 pr-2.5">
                                        <span className="truncate text-xs leading-none ms-2 text-white">
                                            {item.movement_type}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
