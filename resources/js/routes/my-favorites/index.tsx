import {createFileRoute, useNavigate} from '@tanstack/react-router'
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {Star} from "lucide-react";
import api from "@/lib/api";
import UtilityCollection, {EmptyState} from "@/components/layout/UtilityCollection";
import {Button} from "@/components/ui/button";
import {UtilityCardResponse} from "@/types/utility";
import {pageTitle} from "@/hooks/helper";

export const Route = createFileRoute('/my-favorites/')({
    head: () => ({
        meta: [{title: pageTitle("My Favorites")}],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();

    // null = user is not logged in
    const {data: favorites, isLoading} = useQuery<UtilityCardResponse[] | null>({
        queryKey: ['favorites'],
        queryFn: async () => {
            try {
                const response = await api.get<UtilityCardResponse[]>("/favorites");
                return response.data;
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 401) return null;
                throw error;
            }
        },
        retry: false,
    });

    const emptyState = favorites === null ? (
        <EmptyState
            title="Log in to see your favorites"
            text="Save lineups with the star button and find them all here."
            action={<Button onClick={() => navigate({to: "/login"})} className="mt-6 rounded-xl bg-orange-500 text-black hover:bg-orange-400">Login</Button>}
        />
    ) : (
        <EmptyState
            title="No favorites yet"
            text="Open a map, pick a lineup and press the star to save it here."
            action={<Button onClick={() => navigate({to: "/"})} className="mt-6 rounded-xl bg-orange-500 text-black hover:bg-orange-400">Browse maps</Button>}
        />
    );

    return (
        <UtilityCollection
            title="My Favorites"
            icon={
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
                    <Star className="h-8 w-8" fill="currentColor"/>
                </div>
            }
            description="Your saved lineups"
            countLabel="saved lineups"
            utilities={favorites}
            isLoading={isLoading}
            emptyState={emptyState}
        />
    )
}
