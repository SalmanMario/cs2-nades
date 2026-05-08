<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UtilityCoordinateResource;
use App\Http\Resources\MapResource;
use App\Http\Resources\NadeResource;
use App\Http\Resources\TeamResource;
use App\Models\Map;
use App\Models\UtilityCoordinate;
use App\Models\UtilityType;
use App\Models\Team;

class ApiUtilsController extends Controller
{
    public function getNades(){
        return NadeResource::collection(UtilityType::all());
    }

    public function getTeams(){
        return TeamResource::collection(Team::all());
    }

    public function getMap($map){
        $findMap = Map::where('name', $map)->first();
        return MapResource::make($findMap);
    }

    public function getUtilityCoordinates($map){
        $mapId = Map::where('name', $map)->first()->id;
        $utilityCoordinates = UtilityCoordinate::query()->with(['start_utility_coordinates', 'end_utility_coordinates', 'utilities'])->where('map_id', $mapId)->get();
        return UtilityCoordinateResource::collection($utilityCoordinates);
    }
}
