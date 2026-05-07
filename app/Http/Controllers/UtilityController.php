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
        return UtilityResource::collection($utilities);
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

        $startCoords = StartUtilityCoordinate::query()->create([
            'x' => $request->existing_start_coords_x ? $request->existing_start_coords_x : $request->start_coords_x,
            'y' => $request->existing_start_coords_y ? $request->existing_start_coords_y : $request->start_coords_y,
            'title_from' => $request->title_from,
        ]);

        $endCoords = EndUtilityCoordinate::query()->create([
            'x' => $request->existing_end_coords_x ? $request->existing_end_coords_x : $request->end_coords_x,
            'y' => $request->existing_end_coords_y ? $request->existing_end_coords_y : $request->end_coords_y,
            'title_to' => $request->title_to,
        ]);

        $coordinates = UtilityCoordinate::query()->create([
            'start_utility_coordinate_id' => $startCoords->id,
            'end_utility_coordinate_id' => $endCoords->id,
            'utility_type_id' => $request->utility_type_id,
        ]);

        $utility = new Utility();
        $utility->fill([
            'grenade_name' => $request->grenade_name,
            'team_type_id' => $request->team_type_id,
            'technique_type' => strtoupper($request->technique_type),
            'movement_type' => $request->movement_type,
            'map_id' => $mapId,
            'utility_coordinate_id' => $coordinates->id,
        ]);
        $utility->save();

        if ($request->hasFile('image_lineup'))
            $this->attachmentService->process($request->file('image_lineup'), AttachmentType::IMAGE_LINEUP->value, $utility);
        if ($request->hasFile('video_lineup'))
            $this->attachmentService->process($request->file('video_lineup'), AttachmentType::VIDEO_LINEUP->value, $utility);

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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
