import React, {useEffect, useState} from "react";
import {Check, Link} from "lucide-react";
import {cn} from "@/lib/utils";

type Props = {
    mapName: string,
    utilityId: number,
    // show the "Copy link" text next to the icon
    showLabel?: boolean,
    className?: string,
}

export default function CopyLinkButton({mapName, utilityId, showLabel = false, className}: Props) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timeout);
    }, [copied]);

    const copy = async () => {
        const url = `${window.location.origin}/maps/${mapName.toLowerCase()}/${utilityId}`;

        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // clipboard API needs https (or localhost), fall back to the old way
            const input = document.createElement("textarea");
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
        }

        setCopied(true);
    };

    const label = copied ? "Link copied" : "Copy link";
    const Icon = copied ? Check : Link;

    return (
        <button
            type="button"
            onClick={copy}
            title={label}
            aria-label={label}
            className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm transition-colors",
                copied ? "text-emerald-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                // labelled version (lineup page): outlined and the same size as the Report button
                showLabel && "border px-4 py-2 font-semibold",
                showLabel && (copied
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-zinc-400 bg-zinc-800/60 text-zinc-100 hover:border-white hover:bg-zinc-700"),
                className
            )}
        >
            <Icon className="h-5 w-5"/>
            {showLabel && <span aria-live="polite">{copied ? "Copied!" : "Copy link"}</span>}
        </button>
    );
}
