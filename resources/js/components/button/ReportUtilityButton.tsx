import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate} from "@tanstack/react-router";
import {useQueryClient} from "@tanstack/react-query";
import {Flag} from "lucide-react";
import {useAuth} from "@/AuthContext";
import {useMutationApi} from "@/hooks/use-mutation";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {ReportReasonEnum} from "@/types/enums";
import {REPORT_REASON_LABELS} from "@/types/utility";
import {cn} from "@/lib/utils";

type ReportForm = {
    reason: ReportReasonEnum,
    message: string,
}

type ApiErrors = Error & {
    errors: Record<string, string[]>
}

type Props = {
    utilityId: number,
    // the user already has an open report on this lineup
    reportedByMe: boolean,
    className?: string,
}

export default function ReportUtilityButton({utilityId, reportedByMe, className}: Props) {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors}
    } = useForm<ReportForm>({
        defaultValues: {
            reason: "OUTDATED",
            message: "",
        }
    });

    const report = useMutationApi<unknown, ApiErrors, ReportForm>({
        url: `/utilities/${utilityId}/reports`,
        method: "POST",
    });

    const onSubmit = (data: ReportForm) => {
        report.mutate({...data, message: data.message.trim()}, {
            onSuccess: () => {
                setOpen(false);
                reset();
                // lineup page shows the "reported" state, cards show the label
                queryClient.invalidateQueries({queryKey: ['utility', String(utilityId)]});
                queryClient.invalidateQueries({queryKey: ['favorites']});
                queryClient.invalidateQueries({queryKey: ['popularUtilities']});
                queryClient.invalidateQueries({queryKey: ['latestUtilities']});
            },
            onError: (error) => {
                Object.entries(error.errors).forEach(([field, message]) => {
                    setError(field as keyof ReportForm, {message: message[0]})
                })
                if (Object.keys(error.errors).length === 0) setError("root", {message: error.message});
            }
        })
    }

    const handleClick = () => {
        if (!user) {
            navigate({to: "/login", search: {redirect: location.href}}).then();
            return;
        }
        setOpen(true);
    }

    const label = reportedByMe ? "You reported this lineup" : "Report a problem with this lineup";

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={reportedByMe}
                title={label}
                aria-label={label}
                className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
                    reportedByMe
                        ? "border-red-500/30 bg-red-500/5 text-red-400/70"
                        : "border-red-500 bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white",
                    className
                )}
            >
                <Flag className="h-4 w-4" fill={reportedByMe ? "currentColor" : "none"}/>
                {reportedByMe ? "Reported" : "Report"}
            </button>

            <Dialog open={open} onOpenChange={(value) => {
                setOpen(value);
                if (!value) clearErrors();
            }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Report this lineup?</DialogTitle>
                        <DialogDescription>
                            Are you sure something is wrong with this lineup? It will be marked as reported
                            for everyone until we check and fix it.
                        </DialogDescription>
                    </DialogHeader>

                    <form id="report-form" onSubmit={(e) => {
                        clearErrors();
                        handleSubmit(onSubmit)(e);
                    }} className="flex flex-col gap-5">
                        <fieldset>
                            <legend className="mb-2 text-sm font-medium">What's wrong?</legend>
                            <div className="flex flex-col gap-2">
                                {(Object.keys(REPORT_REASON_LABELS) as ReportReasonEnum[]).map((reason) => (
                                    <label key={reason} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2 text-sm has-[:checked]:border-red-500/60 has-[:checked]:bg-red-500/5">
                                        <input type="radio" value={reason} className="accent-red-500"
                                               {...register('reason', {required: "Please choose a reason"})}/>
                                        {REPORT_REASON_LABELS[reason]}
                                    </label>
                                ))}
                            </div>
                            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
                        </fieldset>

                        <div>
                            <Label htmlFor="report-message">Details (optional)</Label>
                            <Textarea id="report-message" rows={3} className="mt-2"
                                      placeholder="e.g. the window was closed in the last Mirage update"
                                      {...register('message', {maxLength: {value: 1000, message: "Keep it under 1000 characters"}})}/>
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                        </div>

                        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
                    </form>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" form="report-form" disabled={report.isPending}
                                className="bg-red-500 text-white hover:bg-red-600">
                            {report.isPending ? "Reporting..." : "Yes, report it"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
