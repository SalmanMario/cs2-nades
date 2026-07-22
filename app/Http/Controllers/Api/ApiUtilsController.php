<?php

namespace App\Http\Controllers\Api;

use App\Enum\AttachmentType;
use App\Enum\MapEnum;
use App\Enum\NadeEnum;
use App\Enum\TeamEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\SearchResultResource;
use App\Http\Resources\SimilarUtilitiesResource;
use App\Http\Resources\NadeResource;
use App\Http\Resources\TeamResource;
use App\Models\Map;
use App\Models\Utility;
use App\Models\UtilityType;
use App\Models\Team;
use App\Services\MapService;
use App\Services\UtilityService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ApiUtilsController extends Controller
{
    public function __construct(private MapService $mapService, private UtilityService $utilityService){}

    public function getNades()
    {
        return NadeResource::collection(UtilityType::all());
    }

    public function getTeams()
    {
        return TeamResource::collection(Team::all());
    }

    public function getUtilityCoordinates($map)
    {
        $map = $this->mapService->getMap($map);
        return $this->utilityService->getUtilityCoordinates($map);
    }

    public function getUtility($map, $utility)
    {
        $mapId = Map::where('name', $map)->first()->id;
        $utility = Utility::query()->with(['team', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])->where('map_id', $mapId)->where('id', $utility)->first();
        return response()->json([
            'created_at' => $utility->created_at,
            'updated_at' => $utility->updated_at,
            'title' => $utility->utilityCoordinates->start_utility_coordinates->title_from . ' - ' . $utility->utilityCoordinates->end_utility_coordinates->title_to,
            'coords' => [
                'start_coords' => [
                    'x' => $utility->utilityCoordinates->start_utility_coordinates->x,
                    'y' => $utility->utilityCoordinates->start_utility_coordinates->y,
                ],
                'end_coords' => [
                    'x' => $utility->utilityCoordinates->end_utility_coordinates->x,
                    'y' => $utility->utilityCoordinates->end_utility_coordinates->y
                ],
            ],
            'type' => $utility->utilityCoordinates->utility_type->name,
            'mapId' => $mapId,
            'team' => $utility->team->name,
            'team_image' => $utility->team->image,
            'team_type' => $utility->team->name,
            'technique' => $utility->technique_type,
            'movement' => $utility->movement_type,
            'key' => $utility->key_type,
            'video' => $utility->attachments->where('type', AttachmentType::VIDEO_LINEUP->value)->where('attachmentable_id', $utility->id)->first(),
            'image' => $utility->attachments->where('type', AttachmentType::IMAGE_LINEUP->value)->where('attachmentable_id', $utility->id)->sortBy('order')->values()
        ]);
    }

    public function getSimilarUtilitiesByCoords(Request $request, $mapId)
    {
        $utilityId = (int)$request->utilityId;
        $mapStartCoords = $request->coords['start_coords'];
        $mapEndCoords = $request->coords['end_coords'];
        $utilities = Utility::query()->with(['utilityCoordinates', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])
            ->where('map_id', $mapId)
            ->whereNotIn('id', [$utilityId])
            ->get();

        $closest = $utilities->sortBy(function (Utility $utility) use ($mapStartCoords, $mapEndCoords) {
            $start = $utility->utilityCoordinates->start_utility_coordinates;
            $end = $utility->utilityCoordinates->end_utility_coordinates;

            $startDist = sqrt(
                ($start->x - $mapStartCoords['x']) ** 2 +
                ($start->y - $mapEndCoords['y']) ** 2
            );

            $endDist = sqrt(
                ($end->x - $mapEndCoords['x']) ** 2 +
                ($end->y - $mapEndCoords['y']) ** 2
            );

            return $startDist + $endDist;
        })->take(3)->values();

        return response()->json(SimilarUtilitiesResource::collection($closest));
    }

    public function getUtilityStats()
    {
        return response()->json([
            'total_utilities' => Utility::count(),
            'total_utilities_t' => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::T->value))->count(),
            'total_utilities_ct' => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::CT->value))->count(),
            'total_utilities_any' => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::ANY->value))->count(),
        ]);
    }
}
