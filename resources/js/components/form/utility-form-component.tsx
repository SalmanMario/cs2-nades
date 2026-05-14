import type {UtilityForm, UtilityFormErrors} from "@/types/utility";
import {useMutationApi} from "@/hooks/use-mutation";
import React, {useEffect, useState} from "react";
import {useQueryApi} from "@/hooks/use-query";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import AdminLayout from "@/layouts/AdminLayout";
import {useForm} from "react-hook-form";
import {SelectForm} from "@/components/select-form";
import {SelectItem} from "@/components/ui/select";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import MapLayoutBackend from "@/components/MapLayoutBackend";
import {FilePond, registerPlugin} from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import {FilePondFile, FilePondInitialFile} from "filepond";
import {useNavigate} from "@tanstack/react-router";
import {CustomPayload} from "vite";
import {parseNumber} from "@/hooks/helper";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function UtilityFormComponent({utility = null, mapName}: {
    utility: UtilityForm | null,
    mapName: string
}) {
    const [isEditingStartCoordinates, setIsEditingStartCoordinates] = useState(false);
    const [isEditingEndCoordinates, setIsEditingEndCoordinates] = useState(false);
    const [startCoordinates, setStartCoordinates] = useState<{ x: number; y: number } | undefined>(undefined);
    const [endCoordinates, setEndCoordinates] = useState<{ x: number; y: number } | undefined>(undefined);
    const [imageLineup, setImageLineup] = useState<FilePondInitialFile[]>([]);
    const [videoLineup, setVideoLineup] = useState<FilePondInitialFile[]>([]);
    const navigate = useNavigate();
    const isEditing = utility ? 'PUT' : 'POST'

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        setError,
        formState: {errors}
    } = useForm<UtilityForm>({
        defaultValues: {
            grenade_name: "",
            utility_type_id: "",
            team_type_id: "",
            technique_type: "",
            movement_type: "",
            existing_start_coords_x: undefined,
            existing_start_coords_y: undefined,
            existing_end_coords_x: undefined,
            existing_end_coords_y: undefined,
            key_type: "",
        }
    });

    const handleImageUpdate = (files: FilePondFile[]) => {
        setImageLineup(files as unknown as FilePondInitialFile[]);
    };

    const handleVideoUpdate = (files: FilePondFile[]) => {
        setVideoLineup(files as unknown as FilePondInitialFile[]);
    };

    const handleMutation = useMutationApi<UtilityForm, UtilityFormErrors>({
        url: utility ? `/utilities/${utility.id}` : '/utilities',
        method: isEditing,
    })

    const onSubmit = (utility: UtilityForm) => {
        const payload = {
            map_name: mapName,
            grenade_name: utility.grenade_name,
            utility_type_id: utility.utility_type_id,
            team_type_id: utility.team_type_id,
            technique_type: utility.technique_type,
            key_type: utility.key_type,
            movement_type: utility.movement_type,
            title_from: utility.title_from,
            title_to: utility.title_to,
            start_coords_x: parseNumber(utility.start_coords_x),
            start_coords_y: parseNumber(utility.start_coords_y),
            existing_start_coords_x: parseNumber(utility.existing_start_coords_x),
            existing_start_coords_y: parseNumber(utility.existing_start_coords_y),
            end_coords_x: parseNumber(utility.end_coords_x),
            end_coords_y: parseNumber(utility.end_coords_y),
            existing_end_coords_x: parseNumber(utility.existing_end_coords_x),
            existing_end_coords_y: parseNumber(utility.existing_end_coords_y),

            image_lineup_ids: (imageLineup as unknown as FilePondFile[])
                .filter(f => f.serverId)
                .map(f => f.serverId),

            video_lineup_ids: (videoLineup as unknown as FilePondFile[])
                .filter(f => f.serverId)
                .map(f => f.serverId),
        };

        handleMutation.mutate(payload, {
            onSuccess: () => {
                reset();
                navigate({
                    to: "/admin/dashboard/maps/$mapName",
                    params:{
                        mapName
                    }
                }).then();
            },
            onError: (error) => {
                console.log(error);
                Object.entries(error.errors).forEach(([field, message]) => {
                    setError(field as keyof UtilityForm, {message: message[0]})
                })
            }
        })
    }

    useEffect(() => {
        if (utility) {
            reset({
                ...utility,
                utility_type_id: String(utility.utility_type_id ?? ""),
                team_type_id: String(utility.team_type_id ?? ""),
                technique_type: utility.technique_type ?? "",
                movement_type: utility.movement_type ?? "",
                title_from: utility.start_coords_title_from ?? "",
                title_to: utility.end_coords_title_to ?? "",
                image_lineup: [],
                video_lineup: [],
            })

            setImageLineup(
                Object.values(utility.image_lineup ?? {}).map((image: any) => ({
                    source: String(image.id),
                    options: {type: 'local'}
                }))
            );

            setVideoLineup(
                Object.values(utility.video_lineup ?? {}).map((video: any) => ({
                    source: String(video.id),
                    options: {type: 'local'}
                }))
            );

            setStartCoordinates({x: Number(utility.start_coords_x), y: Number(utility.start_coords_y)});
            setEndCoordinates({x: Number(utility.end_coords_x), y: Number(utility.end_coords_y)});
        }
    }, [utility, reset])

    const handleIsEditingStartCoordinates = () => {
        setIsEditingStartCoordinates((prev) => !prev)
    }

    const handleIsEditingEndCoordinates = () => {
        setIsEditingEndCoordinates((prev) => !prev)
    }

    const {data: nades} = useQueryApi<{ data: Nade[] }>({
        queryKey: ['nades'],
        method: 'GET',
        url: '/getNades',
    })

    const {data: map} = useQueryApi<{ data: MapResponse }>({
        queryKey: ['map'],
        method: 'GET',
        url: `/getMap/${mapName}`,
    })

    const {data: teams} = useQueryApi<{ data: Team[] }>({
        queryKey: ['teams'],
        method: 'GET',
        url: '/getTeams',
    })

    const {data: utilityCoordinates} = useQueryApi<{data: UtilityForm[]}>({
        queryKey: ['utilityCoordinates'],
        method: 'GET',
        url: `/getUtilityCoordinates/${mapName}`,
    })

    const uniqueStartCoords = utilityCoordinates?.data ? [...new Map(
        utilityCoordinates.data.map((coords) => [coords.existing_start_coords_x + '-' + coords.existing_start_coords_y, coords])
    ).values()] : [];

    const uniqueEndCoords = utilityCoordinates?.data ? [...new Map(
        utilityCoordinates.data.map((coords) => [coords.existing_end_coords_x + '-' + coords.existing_end_coords_y, coords])
    ).values()] : [];

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                        <Label htmlFor="grenade-name" className="">Grenade Name</Label>
                        <Input id="grenade-name" className="mt-2" {...register('grenade_name')} />
                        {errors.grenade_name &&
                            <p className="text-red-500 text-sm mt-1">{errors.grenade_name.message}</p>}
                    </div>

                    <div>
                        <SelectForm name="utility_type_id" label="Utility" placeholder="utility"
                                    control={control}>
                            {nades?.data?.map((nade: Nade) => (
                                <SelectItem key={nade.id} value={String(nade.id)}>
                                    {nade.name}
                                </SelectItem>
                            ))}
                        </SelectForm>
                        {errors.utility_type_id &&
                            <p className="text-red-500 text-sm mt-1">{errors.utility_type_id.message}</p>}
                    </div>

                    <div>
                        <SelectForm name="team_type_id" label="Team" placeholder="team" control={control}>
                            {teams?.data?.map((team: Team) => (
                                <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>
                            ))}
                        </SelectForm>
                        {errors.team_type_id &&
                            <p className="text-red-500 text-sm mt-1">{errors.team_type_id.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-5">
                    <div>
                        <SelectForm name="technique_type" label="Technique" placeholder="technique" control={control}>
                            <SelectItem value="LEFT_CLICK">Left Click</SelectItem>
                            <SelectItem value="RIGHT_CLICK">Right Click</SelectItem>
                            <SelectItem value="LEFT_RIGHT_CLICK">Left + Right Click</SelectItem>
                        </SelectForm>
                        {errors.technique_type &&
                            <p className="text-red-500 text-sm mt-1">{errors.technique_type.message}</p>}
                    </div>

                    <div>
                        <SelectForm name="movement_type" label="Movement" placeholder="movement" control={control}>
                            <SelectItem value="STATIONARY">Stationary</SelectItem>
                            <SelectItem value="WALKING">Walking</SelectItem>
                            <SelectItem value="RUNNING">Running</SelectItem>
                            <SelectItem value="JUMPING">Jumping</SelectItem>
                            <SelectItem value="JUMPING_RUNNING">Jump Running</SelectItem>
                            <SelectItem value="CROUCHING">Crouching</SelectItem>
                            <SelectItem value="CROUCHED_WALKING">Crouched Walking</SelectItem>
                            <SelectItem value="CROUCHED_JUMPING">Crouched Jumping</SelectItem>
                        </SelectForm>
                        {errors.movement_type &&
                            <p className="text-red-500 text-sm mt-1">{errors.movement_type.message}</p>}
                    </div>

                    <div>
                        <SelectForm name="key_type" label="Key" placeholder="Key" control={control}>
                            <SelectItem value="TAP_A">Tap A</SelectItem>
                            <SelectItem value="HOLD_A">Hold A</SelectItem>
                            <SelectItem value="TAP_D">Tap D</SelectItem>
                            <SelectItem value="HOLD_D">Hold D</SelectItem>
                            <SelectItem value="TAP_W">Tap W</SelectItem>
                            <SelectItem value="TAP_W_A">Tap W + A</SelectItem>
                            <SelectItem value="TAP_W_D">Tap W + D</SelectItem>
                            <SelectItem value="HOLD_W">Hold W</SelectItem>
                            <SelectItem value="HOLD_W_A">Hold W + A</SelectItem>
                            <SelectItem value="HOLD_W_D">Hold W + D</SelectItem>
                            <SelectItem value="TAP_S">Tap S</SelectItem>
                            <SelectItem value="HOLD_S">Hold S</SelectItem>
                        </SelectForm>
                        {errors.key_type &&
                            <p className="text-red-500 text-sm mt-1">{errors.key_type.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="title_from" className="">From</Label>
                        <Input type="text" id="title_from" className="mt-2" {...register('title_from')}/>
                        {errors.title_from && <p className="text-red-500 text-sm mt-1">{errors.title_from.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="title_to" className="">To</Label>
                        <Input type="text" id="title_to" className="mt-2" {...register('title_to')}/>
                        {errors.title_to && <p className="text-red-500 text-sm mt-1">{errors.title_to.message}</p>}
                    </div>
                </div>

                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Starting Coords</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="start_coords_x" className="">Start Coords X</Label>
                                    <Input type="number" id="start_coords_x" disabled
                                           className="mt-2" {...register('start_coords_x', {valueAsNumber: true})}/>
                                    {errors.start_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.start_coords_x.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="start_coords_y" className="">Start Coords Y</Label>
                                    <Input type="number" id="start_coords_y" disabled
                                           className="mt-2" {...register('start_coords_y', {valueAsNumber: true})}/>
                                    {errors.start_coords_y &&
                                        <p className="text-red-500 text-sm mt-1">{errors.start_coords_y.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_start_coords_x" label="Existing Start Coords X"
                                                placeholder="Existing Start Coords X" control={control}>
                                        {uniqueStartCoords?.map((coords) => (
                                            <SelectItem key={coords.id_existing_start_coords} value={String(coords.existing_start_coords_x)}>
                                                {coords.existing_start_coords_x} - {coords.title_from}
                                            </SelectItem>
                                        ))}
                                    </SelectForm>
                                    {errors.existing_start_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.existing_start_coords_x.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_start_coords_y" label="Existing Start Coords Y"
                                                placeholder="Existing Start Coords Y" control={control}>
                                        {uniqueStartCoords?.map((coords) => (
                                            <SelectItem key={coords.id_existing_start_coords} value={String(coords.existing_start_coords_y)}>
                                                {coords.existing_start_coords_y} - {coords.title_from}
                                            </SelectItem>
                                        ))}
                                    </SelectForm>
                                    {errors.existing_start_coords_y &&
                                        <p className="text-red-500 text-sm mt-1">{errors.existing_start_coords_y.message}</p>}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>End Coords</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="end_coords_x" className="">End Coords X</Label>
                                    <Input type="number" id="end_coords_x" disabled
                                           className="mt-2" {...register('end_coords_x', {valueAsNumber: true})}/>
                                    {errors.end_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.end_coords_x.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="end_coords_y" className="">End Coords Y</Label>
                                    <Input type="number" id="end_coords_y" disabled
                                           className="mt-2" {...register('end_coords_y', {valueAsNumber: true})}/>
                                    {errors.end_coords_y &&
                                        <p className="text-red-500 text-sm mt-1">{errors.end_coords_y.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_end_coords_x" label="Existing End Coords X"
                                                placeholder="Existing End Coords X" control={control}>
                                        {uniqueEndCoords.map((coords) => (
                                            <SelectItem key={coords.id_existing_end_coords} value={String(coords.existing_end_coords_x)}>
                                                {coords.existing_end_coords_x} - {coords.title_to}
                                            </SelectItem>
                                        ))}
                                    </SelectForm>
                                    {errors.existing_end_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.existing_end_coords_x.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_end_coords_y" label="Existing End Coords Y"
                                                placeholder="Existing End Coords Y" control={control}>
                                        {uniqueEndCoords?.map((coords) => (
                                            <SelectItem key={coords.id_existing_end_coords} value={String(coords.existing_end_coords_y)}>
                                                {coords.existing_end_coords_y} - {coords.title_to}
                                            </SelectItem>
                                        ))}
                                    </SelectForm>
                                    {errors.existing_end_coords_y &&
                                        <p className="text-red-500 text-sm mt-1">{errors.existing_end_coords_y.message}</p>}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Image Lineup</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <FilePond
                                name="image_lineup"
                                files={imageLineup}
                                onupdatefiles={handleImageUpdate}
                                acceptedFileTypes={['image/*']}
                                maxFiles={10}
                                labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
                                allowMultiple={true}
                                server={{
                                    load: {
                                        url: '/attachment/',
                                        method: "GET",
                                    },
                                    process: {
                                        url: '/attachment/upload',
                                        method: 'POST',
                                        headers: {
                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                                        },
                                        onload: (response) => {
                                            const data = JSON.parse(response);
                                            return String(data.id);
                                        },
                                    },
                                }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Video Lineup</AccordionTrigger>
                        <AccordionContent>
                            <FilePond
                                name="video_lineup"
                                files={videoLineup}
                                onupdatefiles={handleVideoUpdate}
                                acceptedFileTypes={["video/mp4"]}
                                maxFiles={1}
                                labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
                                server={{
                                    load: {
                                        url: '/attachment/',
                                        method: "GET"
                                    },
                                    process: {
                                        url: '/attachment/upload',
                                        method: 'POST',
                                        headers: {
                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                                        },
                                        onload: (response) => {
                                            const data = JSON.parse(response);
                                            return String(data.id);
                                        },
                                    },
                                }}
                            />
                            {errors.video_lineup &&
                                <p className="text-red-500 text-sm mt-1">{errors.video_lineup.message}</p>}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Get maps coordinates</AccordionTrigger>
                        <AccordionContent>
                            <div className="justify-center flex gap-2 mt-3 mb-2">
                                <Button type="button" intent="white" disabled={isEditingEndCoordinates}
                                        onClick={handleIsEditingStartCoordinates}>
                                    {isEditingStartCoordinates ? 'Save Coords' : 'Start Coords'}
                                </Button>
                                <Button type="button" intent="success" disabled={isEditingStartCoordinates}
                                        onClick={handleIsEditingEndCoordinates}>
                                    {isEditingEndCoordinates ? 'Save Coords' : 'End Coords'}
                                </Button>
                            </div>
                            <MapLayoutBackend mapImage={map?.data?.map_no_callouts}
                                              editingStartingCoords={isEditingStartCoordinates}
                                              editingEndCoords={isEditingEndCoordinates}
                                              startCoordinates={startCoordinates}
                                              endCoordinates={endCoordinates}

                                              onStartCoordsChange={(coords: { x: number, y: number }) => {
                                                  setStartCoordinates(coords)
                                                  setValue('start_coords_x', parseNumber(coords.x))
                                                  setValue('start_coords_y', parseNumber(coords.y))
                                              }}
                                              onEndCoordsChange={(coords: { x: number, y: number }) => {
                                                  setEndCoordinates(coords);
                                                  setValue('end_coords_x', parseNumber(coords.x));
                                                  setValue('end_coords_y', parseNumber(coords.y));
                                              }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button>{utility ? "Update" : "Create"}</Button>
            </form>
        </AdminLayout>
    )
}
