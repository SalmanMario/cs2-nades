import {createFileRoute, useNavigate} from '@tanstack/react-router'
import React from "react";
import {useQueryClient} from "@tanstack/react-query";
import {Check, Flag, Pencil} from "lucide-react";
import {formatDate, pageTitle} from "@/hooks/helper";
import {useQueryApi} from "@/hooks/use-query";
import {useMutationApi} from "@/hooks/use-mutation";
import {MapsOverviewResponse} from "@/types/map";
import {FlaggedUtilityResponse, REPORT_REASON_LABELS} from "@/types/utility";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import BackendSidebar from "@/components/sidebar/BackendSidebar";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/admin/_auth/dashboard/flagged/')({
    head: () => ({meta: [{title: pageTitle("Flagged Utilities", true)}]}),
    component: RouteComponent,
})

function RouteComponent() {
    const {data: overview} = useQueryApi<MapsOverviewResponse>({
        queryKey: ["mapsOverview"],
        method: "GET",
        url: "/mapsOverview",
    });

    const {data: flagged, isLoading} = useQueryApi<FlaggedUtilityResponse[]>({
        queryKey: ["flaggedUtilities"],
        method: "GET",
        url: "/flagged-utilities",
    });

    return (
        <div>
            <AdminNavbar/>
            <div className="flex min-h-screen">
                <BackendSidebar maps={overview?.maps}/>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-[1700px] p-10">
                        <div className="mb-8">
                            <h1 className="text-4xl mb-3 font-bold">Flagged utilities</h1>
                            <p className="text-zinc-400">
                                Lineups reported by players. Saving a lineup after editing it clears its reports, or dismiss
                                them if the lineup is fine. Tick "Mark as updated" when the fix should show on the Latest page.
                            </p>
                        </div>

                        {isLoading && <div className="py-20 text-center text-zinc-400">Loading flagged utilities...</div>}

                        {!isLoading && !flagged?.length && (
                            <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-800 px-6 py-20 text-center">
                                <Check className="h-12 w-12 text-emerald-400"/>
                                <h2 className="mt-4 text-xl font-semibold">Nothing to review</h2>
                                <p className="mt-2 text-zinc-400">No lineups have been reported.</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {flagged?.map((utility) => <FlaggedUtilityRow key={utility.id} utility={utility}/>)}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function FlaggedUtilityRow({utility}: {utility: FlaggedUtilityResponse}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const dismiss = useMutationApi({
        url: `/flagged-utilities/${utility.id}/dismiss`,
        method: "POST",
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["flaggedUtilities"]});
            queryClient.invalidateQueries({queryKey: ["utility", String(utility.id)]});
        },
    });

    const editUtility = () => {
        navigate({
            to: "/admin/dashboard/maps/$mapName/$id/edit",
            params: {
                mapName: utility.map_name.toLowerCase(),
                id: String(utility.id),
            }
        }).then()
    }

    // e.g. {OUTDATED: 3, WRONG_NAME: 1}
    const reasonCounts = utility.reports.reduce<Record<string, number>>((counts, report) => {
        counts[report.reason] = (counts[report.reason] ?? 0) + 1;
        return counts;
    }, {});

    return (
        <section className="rounded-2xl border border-red-500/30 bg-zinc-900 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img src={utility.map_image} alt={utility.map_name} className="h-12 w-12 object-contain"/>
                    <div>
                        <h2 className="text-xl font-semibold text-white">{utility.title}</h2>
                        <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                            <img src={utility.utility_image} alt={utility.utility_type} className="h-4 w-4"/>
                            {utility.grenade_name} · {utility.map_name}
                            <img src={utility.team_image} alt={utility.team} className="h-5 w-5"/>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        <Flag className="h-3 w-3" fill="currentColor"/>
                        {utility.reports.length} {utility.reports.length === 1 ? "report" : "reports"}
                    </span>
                    <Button variant="outline" onClick={editUtility}>
                        <Pencil/>
                        Edit
                    </Button>
                    <Button variant="outline" onClick={() => dismiss.mutate(undefined)} disabled={dismiss.isPending}>
                        <Check/>
                        {dismiss.isPending ? "Dismissing..." : "Dismiss"}
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(reasonCounts).map(([reason, count]) => (
                    <span key={reason} className="rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                        {REPORT_REASON_LABELS[reason as keyof typeof REPORT_REASON_LABELS]} × {count}
                    </span>
                ))}
            </div>

            <ul className="mt-4 divide-y divide-zinc-800 border-t border-zinc-800">
                {utility.reports.map((report) => (
                    <li key={report.id} className="flex flex-wrap gap-x-4 gap-y-1 py-3 text-sm">
                        <span className="w-28 shrink-0 text-zinc-500">{formatDate(report.created_at)}</span>
                        <span className="w-56 shrink-0 text-zinc-300">{REPORT_REASON_LABELS[report.reason]}</span>
                        <span className="min-w-0 flex-1 whitespace-pre-line text-zinc-400">
                            {report.message || <em className="text-zinc-600">No details</em>}
                        </span>
                        <span className="text-zinc-500">{report.user_name ?? "Deleted user"}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
