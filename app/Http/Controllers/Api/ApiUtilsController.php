<?php

namespace App\Http\Controllers\Api;

use App\Enum\AttachmentType;
use App\Enum\TeamEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\UtilityCoordinateResource;
use App\Http\Resources\MapResource;
use App\Http\Resources\NadeResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UtilityCounterResource;
use App\Http\Resources\UtilityResource;
use App\Models\Map;
use App\Models\Utility;
use App\Models\UtilityCoordinate;
use App\Models\UtilityType;
use App\Models\Team;

class ApiUtilsController extends Controller
{
    public function getNades()
    {
        return NadeResource::collection(UtilityType::all());
    }

    public function getTeams()
    {
        return TeamResource::collection(Team::all());
    }

    public function getMap($map)
    {
        $findMap = Map::where('name', $map)->first();
        return MapResource::make($findMap);
    }

    public function getUtilityCoordinates($map)
    {
        $mapId = Map::where('name', $map)->first()->id;
        $utilityCoordinates = UtilityCoordinate::query()->with(['start_utility_coordinates', 'end_utility_coordinates', 'utilities', 'map'])
            ->where('map_id', $mapId)
            ->get();
        return UtilityCoordinateResource::collection($utilityCoordinates);
    }

    public function getUtility($map, $utility)
    {
        $mapId = Map::where('name', $map)->first()->id;
        $utility = Utility::query()->with(['team', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])->where('map_id', $mapId)->where('id', $utility)->first();
        return response()->json([
            'created_at' => $utility->created_at,
            'updated_at' => $utility->updated_at,
            'title' => $utility->utilityCoordinates->start_utility_coordinates->title_from . ' - ' . $utility->utilityCoordinates->end_utility_coordinates->title_to,
            'type' => $utility->utilityCoordinates->utility_type->name,
            'team' => $utility->team->name,
            'team_image' => $utility->team->image,
            'team_type' => $utility->team->name,
            'technique' => $utility->technique_type,
            'movement' => $utility->movement_type,
            'key' => $utility->key_type,
            'video' => $utility->attachments->where('type', AttachmentType::VIDEO_LINEUP->value)->where('attachmentable_id', $utility->id)->first(),
            'image' => $utility->attachments->where('type', AttachmentType::IMAGE_LINEUP->value)->where('attachmentable_id', $utility->id)
        ]);
    }

    public function getUtilityStats(){
        return response()->json([
            'total_utilities'     => Utility::count(),
            'total_utilities_t'   => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::T->value))->count(),
            'total_utilities_ct'  => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::CT->value))->count(),
            'total_utilities_any' => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::ANY->value))->count(),
        ]);
    }
}
