import React from "react";
import {formatDate} from "@/hooks/helper";
import {UtilityRequestHistoryEntry} from "@/types/utility";
import {cn} from "@/lib/utils";

const DOT_CLASSES = {
    PENDING: "bg-orange-400",
    ADDED: "bg-emerald-400",
    REJECTED: "bg-zinc-500",
};

// "Submitted" for the first entry, a later PENDING means an admin reopened it
export function historyLabel(entry: UtilityRequestHistoryEntry, index: number) {
    if (entry.status === "ADDED") return "Added";
    if (entry.status === "REJECTED") return "Rejected";
    return index === 0 ? "Submitted" : "Reopened";
}

// last change that closed the request, for "Added by X"
export function resolvedEntry(history: UtilityRequestHistoryEntry[]) {
    const last = history[history.length - 1];
    return last && last.status !== "PENDING" ? last : undefined;
}

export default function UtilityRequestHistory({history, className}: {
    history: UtilityRequestHistoryEntry[],
    className?: string,
}) {
    return (
        <ol className={cn("relative ms-1 border-s border-zinc-800", className)}>
            {history.map((entry, index) => (
                <li key={entry.id} className="relative ps-4 pb-3 last:pb-0 text-sm">
                    <span className={cn("absolute -start-[5px] top-1.5 h-2.5 w-2.5 rounded-full", DOT_CLASSES[entry.status])}/>
                    <span className="font-medium text-zinc-200">{historyLabel(entry, index)}</span>
                    <span className="text-zinc-500">
                        {" "}by {entry.user_name ?? "deleted user"} · {formatDate(entry.created_at)}
                    </span>
                </li>
            ))}
        </ol>
    );
}
