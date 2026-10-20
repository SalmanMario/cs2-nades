import {Flag, RefreshCw, Sparkles} from "lucide-react";
import {cn} from "@/lib/utils";

type Props = {
    isFlagged: boolean,
    freshness: "new" | "updated" | null,
    className?: string,
}

// "Reported" takes priority, it stays until the lineup is fixed; "New" / "Updated" last 14 days
export default function UtilityBadge({isFlagged, freshness, className}: Props) {
    if (isFlagged) {
        return (
            <span className={cn("flex w-fit items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white", className)}>
                <Flag className="h-3 w-3" fill="currentColor"/>
                Reported
            </span>
        );
    }

    if (!freshness) return null;

    const isNew = freshness === "new";
    const Icon = isNew ? Sparkles : RefreshCw;

    return (
        <span className={cn(
            "flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-black",
            isNew ? "bg-emerald-400" : "bg-sky-400",
            className
        )}>
            <Icon className="h-3 w-3"/>
            {isNew ? "New" : "Updated"}
        </span>
    );
}
