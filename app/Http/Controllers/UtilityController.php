<?php

namespace App\Http\Controllers;

use App\Enum\AttachmentType;
use App\Http\Requests\UtilityRequest;
use App\Http\Resources\UtilityResource;
use App\Models\Attachment;
use App\Models\EndUtilityCoordinate;
use App\Models\Map;
use App\Models\PopularUtility;
use App\Models\StartUtilityCoordinate;
use App\Models\Utility;
use App\Models\UtilityCoordinate;
use App\Services\AttachmentService;

class UtilityController extends Controller
{
    private AttachmentService $attachmentService;

    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UtilityRequest $request)
    {
        $mapId = Map::where('name', $request->map_name)->first()->id;

        if ($request->start_coords['x'] && $request->start_coords['y']) {
            $startCoords = StartUtilityCoordinate::query()->create([
                'x' => $request->start_coords['x'],
                'y' => $request->start_coords['y'],
                'title_from' => $request->start_coords['title'],
            ]);
        }

        if ($request->end_coords['x'] && $request->end_coords['y']) {
            $endCoords = EndUtilityCoordinate::query()->create([
                'x' => $request->end_coords['x'],
                'y' => $request->end_coords['y'],
                'title_to' => $request->end_coords['title'],
            ]);
        }

        if ($request->existing_start_coords && $request->existing_start_coords['x'] && $request->existing_start_coords['y']) {
            $startCoords = StartUtilityCoordinate::query()->with(['utility_coordinates' => function ($query) use ($mapId) {
                $query->where('map_id', $mapId);
            }])->where('x', $request->existing_start_coords['x'])->where('y', $request->existing_start_coords['y'])->first();
        }

        if ($request->existing_end_coords && $request->existing_end_coords['x'] && $request->existing_end_coords['y']) {
            $endCoords = EndUtilityCoordinate::query()->with(['utility_coordinates' => function ($query) use ($mapId) {
                $query->where('map_id', $mapId);
            }])->where('x', $request->existing_end_coords['x'])->where('y', $request->existing_end_coords['y'])->first();
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
            'notes' => $request->notes,
        ]);
        $utility->save();

        $this->syncPopular($utility, $request->boolean('is_popular'));

        if ($request->image_lineup_ids)
            $this->attachmentService->process($request->image_lineup_ids, AttachmentType::IMAGE_LINEUP->value, $utility);
        if ($request->video_lineup_ids)
            $this->attachmentService->process($request->video_lineup_ids, AttachmentType::VIDEO_LINEUP->value, $utility);

        return response()->json(['message' => 'Utility created successfully'], 201);
    }

    public function edit(string $id)
    {
        $utility = Utility::with(['team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments', 'popular'])->find($id);
        return new UtilityResource($utility);
    }

    public function update(UtilityRequest $request, string $id)
    {
        $utility = Utility::with(['team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])->find($id);
        $startCoords = null;
        $endCoords = null;

        if ($request->start_coords['x'] && $request->start_coords['y']) {
            $startCoords = StartUtilityCoordinate::query()->firstOrCreate([
                'x' => $request->start_coords['x'],
                'y' => $request->start_coords['y'],
            ], [
                'title_from' => $request->start_coords['title'],
            ]);
        }

        if ($request->existing_start_coords && $request->existing_start_coords['x'] && $request->existing_start_coords['y']) {
            $startCoords = StartUtilityCoordinate::query()->where('x', $request->existing_start_coords['x'])
                ->where('y', $request->existing_start_coords['y'])->first();
        }

        if ($request->end_coords['x'] && $request->end_coords['y']) {
            $endCoords = EndUtilityCoordinate::query()->firstOrCreate([
                'x' => $request->end_coords['x'],
                'y' => $request->end_coords['y'],
            ], [
                'title_to' => $request->end_coords['title'],
            ]);
        }
        if ($request->existing_end_coords && $request->existing_end_coords['x'] && $request->existing_end_coords['y']) {
            $endCoords = EndUtilityCoordinate::query()->where('x', $request->existing_end_coords['x'])->where('y', $request->existing_end_coords['y'])->first();
        }

        $utility->utilityCoordinates->update([
            'utility_type_id' => $request->utility_type_id,
            'start_utility_coordinate_id' => $startCoords->id,
            'end_utility_coordinate_id' => $endCoords->id,
        ]);

        $utility->update([
            'grenade_name' => $request->grenade_name,
            'team_id' => $request->team_type_id,
            'technique_type' => $request->technique_type,
            'movement_type' => $request->movement_type,
            'key_type' => $request->key_type,
            'notes' => $request->notes,
            ...($request->boolean('mark_as_updated') ? ['content_updated_at' => now()] : []),
        ]);

        $this->syncPopular($utility, $request->boolean('is_popular'));

        if ($request->image_lineup_ids)
            $this->attachmentService->process($request->image_lineup_ids, AttachmentType::IMAGE_LINEUP->value, $utility);
        if ($request->video_lineup_ids)
            $this->attachmentService->process($request->video_lineup_ids, AttachmentType::VIDEO_LINEUP->value, $utility);

        $retainImgIds = array_merge($request->image_lineup_ids, $request->video_lineup_ids);
        $attachmentsToDelete = $utility->attachments->whereNotIn('id', $retainImgIds);
        $attachmentsToDelete->each(fn($attachment) => $attachment->delete());

        return response()->json(['message' => 'Utility updated successfully'], 200);
    }

    private function syncPopular(Utility $utility, bool $isPopular): void
    {
        if ($isPopular) {
            PopularUtility::query()->firstOrCreate(['utility_id' => $utility->id]);
        } else {
            PopularUtility::query()->where('utility_id', $utility->id)->delete();
        }
    }
}
