import {createFileRoute, useLocation, useNavigate} from '@tanstack/react-router'
import React, {useEffect, useMemo, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ExternalLink, ImagePlus, Lightbulb, Video, X} from "lucide-react";
import {useAuth} from "@/AuthContext";
import api from "@/lib/api";
import {useQueryApi} from "@/hooks/use-query";
import {useMutationApi} from "@/hooks/use-mutation";
import {formatDate, pageTitle} from "@/hooks/helper";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";
import Footer from "@/components/footer/Footer";
import {authInputClass} from "@/components/card/AuthCard";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MapResponse} from "@/types/map";
import {TeamEnum} from "@/types/enums";
import {
    UTILITY_REQUEST_STATUS_CLASSES,
    UTILITY_REQUEST_STATUS_LABELS,
    UtilityRequestResponse
} from "@/types/utility";
import {cn} from "@/lib/utils";
import UtilityRequestHistory, {resolvedEntry} from "@/components/timeline/UtilityRequestHistory";

export const Route = createFileRoute('/request-nade/')({
    head: () => ({meta: [{title: pageTitle("Request a nade")}]}),
    component: RouteComponent,
})

const MAX_IMAGES = 2;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const TEAM_LABELS: Record<TeamEnum, string> = {
    ANY: "Both sides",
    T: "Terrorists",
    CT: "Counter-Terrorists",
};

type RequestForm = {
    grenade_name: string,
    map_id: string,
    utility_type_id: string,
    team_type: TeamEnum,
    description: string,
    source_url: string,
    images: File[],
    video: File | null,
}

type ApiErrors = Error & {
    errors: Record<string, string[]>
}

const defaultValues: RequestForm = {
    grenade_name: "",
    map_id: "",
    utility_type_id: "",
    team_type: "ANY",
    description: "",
    source_url: "",
    images: [],
    video: null,
};

function RouteComponent() {
    const {user} = useAuth();

    return (
        <div className="flex min-h-screen flex-col bg-[#0d0f14]">
            <FrontendNavbar/>

            <div className="flex-1">
                <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
                    <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 md:p-8">
                        <div className="flex flex-wrap items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                                <Lightbulb className="h-8 w-8"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white md:text-4xl">Request a nade</h1>
                                <p className="mt-1 text-zinc-400">
                                    Saw a lineup that's missing here? Send it to us with a link, screenshots or a video and we'll add it.
                                </p>
                            </div>
                        </div>
                    </div>

                    {user ? (
                        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                            <RequestFormSection/>
                            <MyRequestsSection/>
                        </div>
                    ) : (
                        <LoginPrompt/>
                    )}
                </div>
            </div>

            <Footer/>
        </div>
    )
}

function Section({title, text, children}: {title: string, text: string, children: React.ReactNode}) {
    return (
        <section className="flex min-w-0 flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-5 md:p-8">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-zinc-400">{text}</p>
            <div className="mt-6 flex flex-1 flex-col">{children}</div>
        </section>
    );
}

function LoginPrompt() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-800 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">Log in to request a nade</h2>
            <p className="mt-2 text-zinc-400">You need an account so we can let you know when your lineup is added.</p>
            <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => navigate({to: "/login", search: {redirect: location.href}})}>Login</Button>
                <Button onClick={() => navigate({to: "/register"})} className="bg-orange-500 text-black hover:bg-orange-400">
                    Register
                </Button>
            </div>
        </div>
    );
}

function RequestFormSection() {
    const queryClient = useQueryClient();
    const [sent, setSent] = useState(false);

    const {data: maps} = useQueryApi<{ data: MapResponse[] }>({
        queryKey: ['maps'],
        method: 'GET',
        url: '/getMaps',
    });

    const {data: nades} = useQueryApi<{ data: Nade[] }>({
        queryKey: ['nades'],
        method: 'GET',
        url: '/getNades',
    });

    const {data: teams} = useQueryApi<{ data: Team[] }>({
        queryKey: ['teams'],
        method: 'GET',
        url: '/getTeams',
    });

    // team names are the side values: T, CT, ANY
    const teamImages: Partial<Record<TeamEnum, string>> = Object.fromEntries(
        teams?.data?.map((team) => [team.name, team.image]) ?? []
    );

    const {
        register,
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        watch,
        setValue,
        formState: {errors}
    } = useForm<RequestForm>({defaultValues});

    const images = watch('images');
    const video = watch('video');

    const createRequest = useMutationApi<unknown, ApiErrors, FormData>({
        url: "/utility-requests",
        method: "POST",
    });

    const onSubmit = (data: RequestForm) => {
        if (!data.source_url.trim() && !data.images.length && !data.video) {
            setError("source_url", {message: "Add a link, some screenshots or a video so we can check the lineup."});
            return;
        }

        const formData = new FormData();
        formData.append("grenade_name", data.grenade_name.trim());
        formData.append("map_id", data.map_id);
        formData.append("utility_type_id", data.utility_type_id);
        formData.append("team_type", data.team_type);
        formData.append("description", data.description.trim());
        formData.append("source_url", data.source_url.trim());
        data.images.forEach((image) => formData.append("images[]", image));
        if (data.video) formData.append("video", data.video);

        setSent(false);
        createRequest.mutate(formData, {
            onSuccess: () => {
                reset(defaultValues);
                setSent(true);
                queryClient.invalidateQueries({queryKey: ['myUtilityRequests']});
            },
            onError: (error) => {
                Object.entries(error.errors).forEach(([field, message]) => {
                    // "images.2" -> "images"
                    setError(field.split('.')[0] as keyof RequestForm, {message: message[0]})
                })
                if (Object.keys(error.errors).length === 0) setError("root", {message: error.message});
            }
        })
    }

    const addImages = (files: FileList | null) => {
        if (!files) return;
        clearErrors("images");
        const selected = Array.from(files);
        if (selected.some((file) => file.size > MAX_IMAGE_SIZE)) {
            setError("images", {message: "Each screenshot must be smaller than 5 MB."});
            return;
        }
        const next = [...images, ...selected];
        if (next.length > MAX_IMAGES) {
            setError("images", {message: `You can upload up to ${MAX_IMAGES} screenshots.`});
        }
        setValue('images', next.slice(0, MAX_IMAGES));
    }

    const selectVideo = (files: FileList | null) => {
        const file = files?.[0];
        if (!file) return;
        clearErrors("video");
        if (file.type !== "video/mp4") {
            setError("video", {message: "The video must be an mp4 file."});
            return;
        }
        if (file.size > MAX_VIDEO_SIZE) {
            setError("video", {message: "The video must be smaller than 50 MB."});
            return;
        }
        setValue('video', file);
    }

    return (
        <Section title="Lineup details" text="The more details you give, the faster we can add it.">
            <form onSubmit={(e) => {
                clearErrors();
                handleSubmit(onSubmit)(e);
            }} className="flex flex-1 flex-col gap-5">
                <div>
                    <Label htmlFor="grenade_name">Name</Label>
                    <Input id="grenade_name" className={`mt-2 ${authInputClass}`}
                           placeholder="e.g. Window smoke from T spawn"
                           aria-invalid={!!errors.grenade_name}
                           {...register('grenade_name', {
                               required: "Give the lineup a name",
                               maxLength: {value: 120, message: "Keep it under 120 characters"},
                           })}/>
                    {errors.grenade_name && <p className="text-red-500 text-sm mt-1">{errors.grenade_name.message}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <Label>Map</Label>
                        <Controller
                            name="map_id"
                            control={control}
                            rules={{required: "Choose a map"}}
                            render={({field}) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2 w-full" aria-invalid={!!errors.map_id}>
                                        <SelectValue placeholder="Select a map"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maps?.data?.map((map) => (
                                            <SelectItem key={map.id} value={String(map.id)}>
                                                <span className="flex items-center gap-2">
                                                    <img src={map.image} alt="" className="h-5 w-5"/>
                                                    {map.name}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.map_id && <p className="text-red-500 text-sm mt-1">{errors.map_id.message}</p>}
                    </div>

                    <div>
                        <Label>Utility</Label>
                        <Controller
                            name="utility_type_id"
                            control={control}
                            rules={{required: "Choose a utility"}}
                            render={({field}) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2 w-full" aria-invalid={!!errors.utility_type_id}>
                                        <SelectValue placeholder="Select a utility"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nades?.data?.map((nade) => (
                                            <SelectItem key={nade.id} value={String(nade.id)}>
                                                <span className="flex items-center gap-2">
                                                    <img src={nade.image} alt="" className="h-5 w-5"/>
                                                    {nade.name}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.utility_type_id && <p className="text-red-500 text-sm mt-1">{errors.utility_type_id.message}</p>}
                    </div>

                    <div>
                        <Label>Side</Label>
                        <Controller
                            name="team_type"
                            control={control}
                            render={({field}) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2 w-full">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(Object.keys(TEAM_LABELS) as TeamEnum[]).map((team) => (
                                            <SelectItem key={team} value={team}>
                                                <span className="flex items-center gap-2">
                                                    {teamImages[team] && <img src={teamImages[team]} alt="" className="h-5 w-5"/>}
                                                    {TEAM_LABELS[team]}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">How to throw it</Label>
                    <Textarea id="description" rows={4} className="mt-2"
                              placeholder="Where to stand, where to aim, movement (jump throw, run...), left or right click"
                              {...register('description', {maxLength: {value: 2000, message: "Keep it under 2000 characters"}})}/>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <Label htmlFor="source_url">Where did you see it?</Label>
                    <Input id="source_url" type="url" className={`mt-2 ${authInputClass}`}
                           placeholder="YouTube, Twitch clip, Reddit, X..."
                           aria-invalid={!!errors.source_url}
                           {...register('source_url', {maxLength: {value: 500, message: "The link is too long"}})}/>
                    {errors.source_url && <p className="text-red-500 text-sm mt-1">{errors.source_url.message}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label>Screenshots <span className="text-zinc-500">(max {MAX_IMAGES}, 5 MB each)</span></Label>
                        <label className={cn(
                            "mt-2 flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-700 text-sm text-zinc-400 transition hover:border-orange-500/60 hover:text-white",
                            images.length >= MAX_IMAGES && "pointer-events-none opacity-50"
                        )}>
                            <ImagePlus className="h-5 w-5"/>
                            Add screenshots
                            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="sr-only"
                                   disabled={images.length >= MAX_IMAGES}
                                   onChange={(e) => {
                                       addImages(e.target.files);
                                       e.target.value = "";
                                   }}/>
                        </label>
                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
                    </div>

                    <div>
                        <Label>Video <span className="text-zinc-500">(mp4, max 50 MB)</span></Label>
                        <label className="mt-2 flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-700 text-sm text-zinc-400 transition hover:border-orange-500/60 hover:text-white">
                            <Video className="h-5 w-5"/>
                            {video ? "Replace video" : "Add a video"}
                            <input type="file" accept="video/mp4" className="sr-only"
                                   onChange={(e) => {
                                       selectVideo(e.target.files);
                                       e.target.value = "";
                                   }}/>
                        </label>
                        {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video.message}</p>}
                    </div>
                </div>

                {(!!images.length || video) && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {images.map((image, index) => (
                            <FilePreview key={`${image.name}-${index}`} file={image}
                                         onRemove={() => setValue('images', images.filter((_, i) => i !== index))}/>
                        ))}
                        {video && <FilePreview file={video} onRemove={() => setValue('video', null)}/>}
                    </div>
                )}

                {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

                <div className="mt-auto flex flex-wrap items-center gap-4">
                    <Button type="submit" disabled={createRequest.isPending}
                            className="h-11 rounded-xl bg-orange-500 px-6 text-base text-black hover:bg-orange-400">
                        {createRequest.isPending ? "Sending..." : "Send request"}
                    </Button>
                    {sent && <p className="text-sm text-emerald-400">Thanks! We will review your lineup soon.</p>}
                </div>
            </form>
        </Section>
    );
}

function FilePreview({file, onRemove}: {file: File, onRemove: () => void}) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);
    useEffect(() => () => URL.revokeObjectURL(url), [url]);

    return (
        <div className={cn(
            "relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-700 bg-black",
            // video takes the whole row, screenshots go two per row
            file.type.startsWith("video/") && "sm:col-span-2"
        )}>
            {file.type.startsWith("video/")
                ? <video src={url} controls muted className="h-full w-full object-contain"/>
                : <img src={url} alt={file.name} className="h-full w-full object-contain"/>}
            <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`}
                    className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500">
                <X className="h-4 w-4"/>
            </button>
        </div>
    );
}

function ResolvedBy({request}: {request: UtilityRequestResponse}) {
    const resolved = resolvedEntry(request.history);
    if (!resolved) return null;

    return (
        <p className="mt-2 text-sm text-zinc-400">
            {resolved.status === "ADDED" ? "Added" : "Rejected"} by{" "}
            <span className="text-zinc-200">{resolved.user_name ?? "deleted user"}</span> · {formatDate(resolved.created_at)}
        </p>
    );
}

function MyRequestsSection() {
    const {data: requests, isLoading} = useQuery<UtilityRequestResponse[]>({
        queryKey: ['myUtilityRequests'],
        queryFn: async () => (await api.get<UtilityRequestResponse[]>("/my-utility-requests")).data,
    });

    const stats: {label: string, value: number, className: string}[] = [
        {label: "Sent", value: requests?.length ?? 0, className: "text-white"},
        {label: "Pending", value: requests?.filter((r) => r.status === "PENDING").length ?? 0, className: "text-orange-400"},
        {label: "Added", value: requests?.filter((r) => r.status === "ADDED").length ?? 0, className: "text-emerald-400"},
        {label: "Rejected", value: requests?.filter((r) => r.status === "REJECTED").length ?? 0, className: "text-zinc-400"},
    ];

    return (
        <Section title="Your requests" text="Lineups you sent us and their status.">
            {!!requests?.length && (
                <div className="mb-4 grid grid-cols-4 gap-2">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-2 py-3 text-center">
                            <p className={cn("text-2xl font-bold", stat.className)}>{stat.value}</p>
                            <p className="text-xs text-zinc-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}
            {isLoading && <p className="text-zinc-400">Loading...</p>}
            {!isLoading && !requests?.length && (
                <p className="rounded-2xl border border-dashed border-zinc-800 px-4 py-10 text-center text-zinc-500">
                    You haven't requested any lineup yet.
                </p>
            )}
            <ul className="flex flex-col gap-3">
                {requests?.map((request) => (
                    <li key={request.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-white">{request.grenade_name}</p>
                                <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                                    <img src={request.utility_image} alt={request.utility_type} className="h-4 w-4"/>
                                    {request.map_name} · {formatDate(request.created_at)}
                                </p>
                            </div>
                            <span className={cn("shrink-0 rounded-lg border px-2 py-1 text-xs font-semibold", UTILITY_REQUEST_STATUS_CLASSES[request.status])}>
                                {UTILITY_REQUEST_STATUS_LABELS[request.status]}
                            </span>
                        </div>
                        {request.source_url && (
                            <a href={request.source_url} target="_blank" rel="noopener noreferrer nofollow"
                               className="mt-2 flex items-center gap-1 truncate text-sm text-orange-400 hover:underline">
                                <ExternalLink className="h-3 w-3 shrink-0"/>
                                <span className="truncate">{request.source_url}</span>
                            </a>
                        )}
                        <ResolvedBy request={request}/>
                        {request.history.length > 1 && (
                            <details className="mt-3">
                                <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300">History</summary>
                                <UtilityRequestHistory history={request.history} className="mt-3"/>
                            </details>
                        )}
                    </li>
                ))}
            </ul>
        </Section>
    );
}
