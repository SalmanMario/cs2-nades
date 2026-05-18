<?php

namespace App\Http\Controllers\Api;

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

    public function getUtilityStats(){
        return response()->json([
            'total_utilities'     => Utility::count(),
            'total_utilities_t'   => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::T->value))->count(),
            'total_utilities_ct'  => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::CT->value))->count(),
            'total_utilities_any' => Utility::whereHas('team', fn($q) => $q->where('name', TeamEnum::ANY->value))->count(),
        ]);
    }
}
