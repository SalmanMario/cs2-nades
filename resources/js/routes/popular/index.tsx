import {createFileRoute, useNavigate} from '@tanstack/react-router'
import React from "react";
import {Flame} from "lucide-react";
import {useQueryApi} from "@/hooks/use-query";
import UtilityCollection, {EmptyState} from "@/components/layout/UtilityCollection";
import {Button} from "@/components/ui/button";
import {UtilityCardResponse} from "@/types/utility";
import {pageTitle} from "@/hooks/helper";

export const Route = createFileRoute('/popular/')({
    head: () => ({
        meta: [{title: pageTitle("Popular Lineups")}],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();

    const {data: popular, isLoading} = useQueryApi<UtilityCardResponse[]>({
        queryKey: ['popularUtilities'],
        method: "GET",
        url: "/popular-utilities",
    });

    return (
        <UtilityCollection
            title="Popular"
            icon={
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                    <Flame className="h-8 w-8" fill="currentColor"/>
                </div>
            }
            description="The essential lineups every player should know"
            countLabel="popular lineups"
            utilities={popular}
            isLoading={isLoading}
            emptyState={
                <EmptyState
                    title="No popular lineups yet"
                    text="Check back soon, or browse all lineups by map."
                    action={<Button onClick={() => navigate({to: "/"})} className="mt-6 rounded-xl bg-orange-500 text-black hover:bg-orange-400">Browse maps</Button>}
                />
            }
        />
    )
}
