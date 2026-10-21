import {createFileRoute, useNavigate} from '@tanstack/react-router'
import React, {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {Check, ExternalLink, Inbox, Plus, RotateCcw, Trash2, X} from "lucide-react";
import {formatDate, pageTitle} from "@/hooks/helper";
import {useQueryApi} from "@/hooks/use-query";
import {useMutationApi} from "@/hooks/use-mutation";
import {MapsOverviewResponse} from "@/types/map";
import {UtilityRequestStatusEnum} from "@/types/enums";
import {
    UTILITY_REQUEST_STATUS_CLASSES,
    UTILITY_REQUEST_STATUS_LABELS,
    UtilityRequestResponse
} from "@/types/utility";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import BackendSidebar from "@/components/sidebar/BackendSidebar";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import UtilityRequestHistory from "@/components/timeline/UtilityRequestHistory";

export const Route = createFileRoute('/admin/_auth/dashboard/requests/')({
    head: () => ({meta: [{title: pageTitle("Nade Requests", true)}]}),
    component: RouteComponent,
})

const TEAM_LABELS = {ANY: "Both sides", T: "T side", CT: "CT side"};

function RouteComponent() {
    const [showAll, setShowAll] = useState(false);

    const {data: overview} = useQueryApi<MapsOverviewResponse>({
        queryKey: ["mapsOverview"],
        method: "GET",
        url: "/mapsOverview",
    });

    const {data: requests, isLoading} = useQueryApi<UtilityRequestResponse[]>({
        queryKey: ["utilityRequests"],
        method: "GET",
        url: "/utility-requests",
    });

    const visible = showAll ? requests : requests?.filter((request) => request.status === "PENDING");

    return (
        <div>
            <AdminNavbar/>
            <div className="flex min-h-screen">
                <BackendSidebar maps={overview?.maps}/>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-[1700px] p-10">
                        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl mb-3 font-bold">Nade requests</h1>
                                <p className="text-zinc-400">
                                    Lineups suggested by players. Add the lineup from the map page, then mark the request as added.
                                </p>
                            </div>
                            <div className="flex rounded-lg border border-zinc-800 p-1 text-sm">
                                {[false, true].map((all) => (
                                    <button key={String(all)} onClick={() => setShowAll(all)}
                                            className={cn("cursor-pointer rounded-md px-3 py-1", showAll === all ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white")}>
                                        {all ? "All" : "Pending"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isLoading && <div className="py-20 text-center text-zinc-400">Loading requests...</div>}

                        {!isLoading && !visible?.length && (
                            <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-800 px-6 py-20 text-center">
                                <Inbox className="h-12 w-12 text-emerald-400"/>
                                <h2 className="mt-4 text-xl font-semibold">Nothing to review</h2>
                                <p className="mt-2 text-zinc-400">No {showAll ? "" : "pending "}requests from players.</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {visible?.map((request) => <RequestRow key={request.id} request={request}/>)}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function RequestRow({request}: {request: UtilityRequestResponse}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onSuccess = () => queryClient.invalidateQueries({queryKey: ["utilityRequests"]});

    const updateStatus = useMutationApi<unknown, Error, {status: UtilityRequestStatusEnum}>({
        url: `/utility-requests/${request.id}/status`,
        method: "POST",
        onSuccess,
    });

    const remove = useMutationApi({
        url: `/utility-requests/${request.id}`,
        method: "DELETE",
        onSuccess,
    });

    const addUtility = () => {
        navigate({
            to: "/admin/dashboard/maps/$mapName/create",
            params: {mapName: request.map_name.toLowerCase()},
            search: {request: request.id},
        }).then()
    }

    return (
        <section className={cn(
            "rounded-2xl border bg-zinc-900 p-6",
            request.status === "PENDING" ? "border-orange-500/30" : "border-zinc-800 opacity-80"
        )}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img src={request.map_image} alt={request.map_name} className="h-12 w-12 object-contain"/>
                    <div>
                        <h2 className="text-xl font-semibold text-white">{request.grenade_name}</h2>
                        <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                            <img src={request.utility_image} alt={request.utility_type} className="h-4 w-4"/>
                            {request.utility_type} · {request.map_name} · {TEAM_LABELS[request.team_type]}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            {request.user_name ?? "Deleted user"} · {formatDate(request.created_at)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-lg border px-2 py-1 text-xs font-semibold", UTILITY_REQUEST_STATUS_CLASSES[request.status])}>
                        {UTILITY_REQUEST_STATUS_LABELS[request.status]}
                    </span>
                    {request.status === "PENDING" ? (
                        <>
                            <Button variant="outline" onClick={addUtility}>
                                <Plus/>
                                Add lineup
                            </Button>
                            <Button variant="outline" disabled={updateStatus.isPending}
                                    onClick={() => updateStatus.mutate({status: "ADDED"})}>
                                <Check/>
                                Mark as added
                            </Button>
                            <Button variant="outline" disabled={updateStatus.isPending}
                                    onClick={() => updateStatus.mutate({status: "REJECTED"})}>
                                <X/>
                                Reject
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" disabled={updateStatus.isPending}
                                onClick={() => updateStatus.mutate({status: "PENDING"})}>
                            <RotateCcw/>
                            Reopen
                        </Button>
                    )}
                    <Button variant="outline" disabled={remove.isPending} title="Delete request and its files"
                            onClick={() => remove.mutate(undefined)}
                            className="text-red-400 hover:bg-red-500 hover:text-white">
                        <Trash2/>
                    </Button>
                </div>
            </div>

            {request.description && (
                <p className="mt-4 whitespace-pre-line border-t border-zinc-800 pt-4 text-sm text-zinc-300">
                    {request.description}
                </p>
            )}

            {request.source_url && (
                <a href={request.source_url} target="_blank" rel="noopener noreferrer nofollow"
                   className="mt-4 flex w-fit max-w-full items-center gap-2 text-sm text-orange-400 hover:underline">
                    <ExternalLink className="h-4 w-4 shrink-0"/>
                    <span className="truncate">{request.source_url}</span>
                </a>
            )}

            {!!request.media.length && (
                <div className="mt-4 flex flex-wrap gap-3">
                    {request.media.map((file) => file.type === "video" ? (
                        <video key={file.path} src={file.path} controls className="h-48 rounded-lg border border-zinc-700 bg-black"/>
                    ) : (
                        <a key={file.path} href={file.path} target="_blank" rel="noopener noreferrer">
                            <img src={file.path} alt="" className="h-48 rounded-lg border border-zinc-700 object-cover hover:border-orange-500"/>
                        </a>
                    ))}
                </div>
            )}

            <div className="mt-4 border-t border-zinc-800 pt-4">
                <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">History</p>
                <UtilityRequestHistory history={request.history}/>
            </div>
        </section>
    );
}
