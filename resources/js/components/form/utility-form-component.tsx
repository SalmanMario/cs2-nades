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
            existing_start_coords_x: "",
            existing_start_coords_y: "",
            existing_end_coords_x: "",
            existing_end_coords_y: "",
        }
    });

    const handleImageUpdate = (files: FilePondFile[]) => {
        setImageLineup(files as unknown as FilePondInitialFile[]);
    };

    const handleVideoUpdate = (files: FilePondFile[]) => {
        setVideoLineup(files as unknown as FilePondInitialFile[]);
    };

    const handleMutation = useMutationApi<UtilityForm, UtilityFormErrors, FormData>({
        url: utility ? `/utilities/${utility.id}` : '/utilities',
        method: isEditing,
    })

    const onSubmit = (utility: UtilityForm) => {
        const formData = new FormData();
        formData.append('map_name', mapName);
        formData.append("grenade_name", utility.grenade_name);
        formData.append("utility_type_id", utility.utility_type_id);
        formData.append("team_type_id", utility.team_type_id);
        formData.append("technique_type", utility.technique_type);
        formData.append("movement_type", utility.movement_type);
        formData.append("title_from", utility.title_from);
        formData.append("title_to", utility.title_to);
        formData.append("start_coords_x", utility.start_coords_x);
        formData.append("start_coords_y", utility.start_coords_y);
        formData.append("existing_start_coords_x", utility.existing_start_coords_x);
        formData.append("existing_start_coords_y", utility.existing_start_coords_y);
        formData.append("end_coords_x", utility.end_coords_x);
        formData.append("end_coords_y", utility.end_coords_y);
        formData.append("existing_end_coords_x", utility.existing_end_coords_x);
        formData.append("existing_end_coords_y", utility.existing_end_coords_y);

        (imageLineup as unknown as FilePondFile[]).forEach((file) => {
            if (file.serverId) {
                formData.append("image_lineup_ids[]", file.serverId);
            }
        });

        (videoLineup as unknown as FilePondFile[]).forEach((file) => {
            if (file.serverId) {
                formData.append("video_lineup_ids[]", file.serverId);
            }
        })

        handleMutation.mutate(formData, {
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
                technique_type: utility.technique_type.toLocaleLowerCase() ?? "",
                movement_type: utility.movement_type.toLocaleLowerCase() ?? "",
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

    const {data: utilityCoordinates} = useQueryApi({
        queryKey: ['utilityCoordinates'],
        method: 'GET',
        url: `/getUtilityCoordinates/${mapName}`,
    })

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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                            <SelectItem value="JUMPING">Jumping</SelectItem>
                            <SelectItem value="RUNNING">Running</SelectItem>
                            <SelectItem value="CROUCHING">Crouching</SelectItem>
                            <SelectItem value="CROUCHED_WALKING">Crouched Walking</SelectItem>
                        </SelectForm>
                        {errors.movement_type &&
                            <p className="text-red-500 text-sm mt-1">{errors.movement_type.message}</p>}
                    </div>

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
                                    <Input type="text" id="start_coords_x" disabled
                                           className="mt-2" {...register('start_coords_x')}/>
                                    {errors.start_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.start_coords_x.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="start_coords_y" className="">Start Coords Y</Label>
                                    <Input type="text" id="start_coords_y" disabled
                                           className="mt-2" {...register('start_coords_y')}/>
                                    {errors.start_coords_y &&
                                        <p className="text-red-500 text-sm mt-1">{errors.start_coords_y.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_start_coords_x" label="Existing Start Coords X"
                                                placeholder="existing_start_coords_x" control={control}>
                                        {utilityCoordinates?.data?.map((coords) => (
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
                                                placeholder="existing_start_coords_y" control={control}>
                                        {utilityCoordinates?.data?.map((coords) => (
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
                                    <Input type="text" id="end_coords_x" disabled
                                           className="mt-2" {...register('end_coords_x')}/>
                                    {errors.end_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.end_coords_x.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="end_coords_y" className="">End Coords Y</Label>
                                    <Input type="text" id="end_coords_y" disabled
                                           className="mt-2" {...register('end_coords_y')}/>
                                    {errors.end_coords_y &&
                                        <p className="text-red-500 text-sm mt-1">{errors.end_coords_y.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_end_coords_x" label="Existing End Coords X"
                                                placeholder="existing_end_coords_x" control={control}>
                                        {utilityCoordinates?.data?.map((coords) => (
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
                                                placeholder="existing_end_coords_y" control={control}>
                                        {utilityCoordinates?.data?.map((coords) => (
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
                                                  setValue('start_coords_x', String(coords.x))
                                                  setValue('start_coords_y', String(coords.y))
                                              }}
                                              onEndCoordsChange={(coords: { x: number, y: number }) => {
                                                  setEndCoordinates(coords);
                                                  setValue('end_coords_x', String(coords.x));
                                                  setValue('end_coords_y', String(coords.y));
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
