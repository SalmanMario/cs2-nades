import {createFileRoute, useNavigate} from '@tanstack/react-router'
import React from "react";
import {Sparkles} from "lucide-react";
import {useQueryApi} from "@/hooks/use-query";
import UtilityCollection, {EmptyState} from "@/components/layout/UtilityCollection";
import {Button} from "@/components/ui/button";
import {UtilityCardResponse} from "@/types/utility";
import {pageTitle} from "@/hooks/helper";

export const Route = createFileRoute('/latest/')({
    head: () => ({
        meta: [{title: pageTitle("Latest Lineups")}],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();

    const {data: latest, isLoading} = useQueryApi<UtilityCardResponse[]>({
        queryKey: ['latestUtilities'],
        method: "GET",
        url: "/latest-utilities",
    });

    return (
        <UtilityCollection
            title="Latest"
            icon={
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                    <Sparkles className="h-8 w-8"/>
                </div>
            }
            description="New lineups and lineups fixed after map updates"
            countLabel="latest lineups"
            utilities={latest}
            isLoading={isLoading}
            emptyState={
                <EmptyState
                    title="No lineups yet"
                    text="New and updated lineups will show up here."
                    action={<Button onClick={() => navigate({to: "/"})} className="mt-6 rounded-xl bg-orange-500 text-black hover:bg-orange-400">Browse maps</Button>}
                />
            }
        />
    )
}
