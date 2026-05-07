import type {UtilityForm} from "@/types/Utility";
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

export default function UtilityFormComponent({utility = null, mapName}: {
    utility: UtilityForm | null,
    mapName: string
}) {
    const [isEditingStartCoordinates, setIsEditingStartCoordinates] = useState(false);
    const [isEditingEndCoordinates, setIsEditingEndCoordinates] = useState(false);
    const isEditing = utility ? 'PUT' : 'POST'
    type Nade = {
        id: string,
        name: string,
        image: string,
    }

    type Teams = {
        id: string,
        name: string,
        image: string,
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
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

    const handleMutation = useMutationApi<UtilityForm, Error, FormData>({
        url: utility ? `/utilities/${utility.id}` : '/utilities-img',
        method: isEditing,
    })

    console.log(utility)

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

        if (utility.image_lineup)
            utility.image_lineup.forEach((file) => {
                formData.append("image_lineup[]", file);
            });

        if (utility.video_lineup)
            utility.video_lineup.forEach((file) => {
                formData.append("video_lineup[]", file);
            });
        handleMutation.mutate(formData, {
            onSuccess: () => {
                reset()
            },
            onError: (error) => {
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
        }
    }, [utility, reset])

    const imageFiles = watch('image_lineup') as File[]
    const previewImageUrls = imageFiles
        ? imageFiles.filter((f) => f instanceof File).map((file) => URL.createObjectURL(file))
        : []

    useEffect(() => {
        return () => {
            previewImageUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewImageUrls]);

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

    const {data: teams} = useQueryApi<{ data: Teams[] }>({
        queryKey: ['teams'],
        method: 'GET',
        url: '/getTeams',
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
                            {teams?.data?.map((team: Teams) => (
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
                            <SelectItem value="left_click">Left Click</SelectItem>
                            <SelectItem value="right_click">Right Click</SelectItem>
                            <SelectItem value="left_right_click">Left + Right Click</SelectItem>
                        </SelectForm>
                        {errors.technique_type &&
                            <p className="text-red-500 text-sm mt-1">{errors.technique_type.message}</p>}
                    </div>

                    <div>
                        <SelectForm name="movement_type" label="Movement" placeholder="movement" control={control}>
                            <SelectItem value="stationary">Stationary</SelectItem>
                            <SelectItem value="walking">Walking</SelectItem>
                            <SelectItem value="jumping">Jumping</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="crouching">Crouching</SelectItem>
                            <SelectItem value="crouched_walking">Crouched Walking</SelectItem>
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
                                        <SelectItem value="100">100 T Spawn</SelectItem>
                                    </SelectForm>
                                    {errors.existing_start_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.existing_start_coords_x.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_start_coords_y" label="Existing Start Coords Y"
                                                placeholder="existing_start_coords_y" control={control}>
                                        <SelectItem value="150">150 T Spawn</SelectItem>
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
                                        <SelectItem value="612">612 Mid</SelectItem>
                                    </SelectForm>
                                    {errors.existing_end_coords_x &&
                                        <p className="text-red-500 text-sm mt-1">{errors.existing_end_coords_x.message}</p>}
                                </div>

                                <div>
                                    <SelectForm name="existing_end_coords_y" label="Existing End Coords Y"
                                                placeholder="existing_end_coords_y" control={control}>
                                        <SelectItem value="475">475 Mid</SelectItem>
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
                            <Input type="file" id="image_lineup" accept="image/*" multiple onChange={(e) => {
                                const files = e.target.files
                                setValue('image_lineup', files ? Array.from(files) : [], {shouldDirty: true})
                            }}/>
                            {errors.image_lineup &&
                                <p className="text-red-500 text-sm mt-1">{errors.image_lineup.message}</p>}
                            {previewImageUrls.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">New Images</p>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {previewImageUrls.map((image, index) => (
                                            <div key={index}
                                                 className="overflow-hidden rounded-md border bg-muted aspect-4/3">
                                                <img
                                                    src={image}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-50 h-50 object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Video Lineup</AccordionTrigger>
                        <AccordionContent>
                            <Input
                                type="file"
                                id="video-lineup"
                                accept="video/*"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files
                                    setValue('video_lineup', files ? Array.from(files) : [], {shouldDirty: true})
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
                                              onStartCoordsChange={(coords: { x: number, y: number }) => {
                                                  setValue('start_coords_x', String(coords.x))
                                                  setValue('start_coords_y', String(coords.y))
                                              }}
                                              onEndCoordsChange={(coords: { x: number, y: number }) => {
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
