<?php

namespace App\Http\Controllers;

use App\Enum\AttachmentType;
use App\Http\Requests\UtilityRequest;
use App\Http\Resources\UtilityResource;
use App\Models\EndUtilityCoordinate;
use App\Models\Map;
use App\Models\StartUtilityCoordinate;
use App\Models\Utility;
use App\Models\UtilityCoordinate;
use App\Services\AttachmentService;
use Illuminate\Http\Request;

class UtilityController extends Controller
{
    private AttachmentService $attachmentService;

    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index($mapName)
    {
        $map = Map::where('name', $mapName)->first()->id;
        $utilities = Utility::where('map_id', $map)
            ->with(['team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates'])
            ->get();
        return UtilityResource::collection($utilities)->additional([
            'total_utilities' => $utilities->count(),
            'total_utilities_t' => $utilities->where("team_id", 1)->count(),
            'total_utilities_ct' => $utilities->where("team_id", 2)->count(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UtilityRequest $request)
    {
        $mapId = Map::where('name', $request->map_name)->first()->id;

        if ($request->start_coords_x && $request->start_coords_y) {
            $startCoords = StartUtilityCoordinate::query()->create([
                'x' => $request->start_coords_x,
                'y' => $request->start_coords_y,
                'title_from' => $request->title_from,
            ]);
        }

        if ($request->end_coords_x && $request->end_coords_y) {
            $endCoords = EndUtilityCoordinate::query()->create([
                'x' => $request->end_coords_x,
                'y' => $request->end_coords_y,
                'title_to' => $request->title_to,
            ]);
        }

        if ($request->existing_start_coords_x && $request->existing_start_coords_y) {
            $startCoords = StartUtilityCoordinate::query()->with(['utility_coordinates' => function ($query) use ($mapId) {
                $query->where('map_id', $mapId);
            }])->where('x', $request->existing_start_coords_x)->where('y', $request->existing_start_coords_y)->first();
        }

        if ($request->existing_end_coords_x && $request->existing_end_coords_y) {
            $endCoords = EndUtilityCoordinate::query()->with(['utility_coordinates' => function ($query) use ($mapId) {
                $query->where('map_id', $mapId);
            }])->where('x', $request->existing_end_coords_x)->where('y', $request->existing_end_coords_y)->first();
        }

        $coordinates = UtilityCoordinate::query()->create([
            'map_id' => $mapId,
            'start_utility_coordinate_id' => $startCoords->id,
            'end_utility_coordinate_id' => $endCoords->id,
            'utility_type_id' => $request->utility_type_id,
        ]);

        $utility = new Utility();
        $utility->fill([
            'grenade_name' => $request->grenade_name,
            'team_id' => $request->team_type_id,
            'technique_type' => $request->technique_type,
            'movement_type' => $request->movement_type,
            'map_id' => $mapId,
            'utility_coordinate_id' => $coordinates->id,
            'key_type' => $request->key_type,
        ]);
        $utility->save();

        if ($request->image_lineup_ids)
            $this->attachmentService->process($request->image_lineup_ids, AttachmentType::IMAGE_LINEUP->value, $utility);
        if ($request->video_lineup_ids)
            $this->attachmentService->process($request->video_lineup_ids, AttachmentType::VIDEO_LINEUP->value, $utility);

        return response()->json(['message' => 'Utility created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $utility = Utility::with(['team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])->find($id);
        return new UtilityResource($utility);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UtilityRequest $request, string $id)
    {
        $utility = Utility::with(['team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])->find($id);

        if ($request->start_coords_x && $request->start_coords_y) {
            $startCoords = StartUtilityCoordinate::query()->firstOrCreate([
                'x' => $request->start_coords_x,
                'y' => $request->start_coords_y,
            ], [
                'title_from' => $request->title_from,
            ]);
        } else if ($request->existing_start_coords_x && $request->existing_start_coords_y) {
            $startCoords = StartUtilityCoordinate::query()->where('x', $request->existing_start_coords_x)->where('y', $request->existing_start_coords_y)->first();
        }

        if ($request->end_coords_x && $request->end_coords_y) {
            $endCoords = EndUtilityCoordinate::query()->firstOrCreate([
                'x' => $request->end_coords_x,
                'y' => $request->end_coords_y,
            ], [
                'title_to' => $request->title_to,
            ]);
        } else if ($request->existing_end_coords_x && $request->existing_end_coords_y) {
            $endCoords = EndUtilityCoordinate::query()->where('x', $request->existing_end_coords_x)->where('y', $request->existing_end_coords_y)->first();
        }

        $utility->utilityCoordinates->update([
            'utility_type_id' => $request->utility_type_id,
            'start_utility_coordinate_id' => $startCoords->id ?? $utility->utilityCoordinates->start_utility_coordinate_id,
            'end_utility_coordinate_id' => $endCoords->id ?? $utility->utilityCoordinates->end_utility_coordinate_id,
        ]);

        $utility->update([
            'grenade_name' => $request->grenade_name,
            'team_id' => $request->team_type_id,
            'technique_type' => $request->technique_type,
            'movement_type' => $request->movement_type,
        ]);

        if ($request->hasFile('image_lineup'))
            $this->attachmentService->process($request->file('image_lineup'), AttachmentType::IMAGE_LINEUP->value, $utility);
        if ($request->hasFile('video_lineup'))
            $this->attachmentService->process($request->file('video_lineup'), AttachmentType::VIDEO_LINEUP->value, $utility);

        return response()->json(['message' => 'Utility updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
