<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapResource;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use App\Services\MapService;
use App\Services\UtilityService;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function __construct(private MapService $mapService, private UtilityService $utilityService){}

    public function maps()
    {
        return MapResource::collection($this->mapService->getMaps());
    }

    public function getMap($map)
    {
        return MapResource::make($this->mapService->getMap($map));
    }

    public function mapsOverview()
    {
        $maps = $this->mapService->getMaps();

        return response()->json([
            'maps' => MapResource::collection($maps),
            'maps_count' => $maps->count(),
            'nade_count' => $this->utilityService->getNadeCountByMap($maps),
            'utilities' => $this->utilityService->getUtilities($maps),
            'utilities_count' => $this->utilityService->getUtilitiesCount(),
        ]);
    }

    public function mapOverview(Request $request){
        $map = $this->mapService->getMap($request->map);
        $maps = $this->mapService->getMaps();
        $teams = Team::all();

        return response()->json([
            'map' => MapResource::make($map),
            'maps' => MapResource::collection($maps),
            'utilities' => $this->utilityService->getUtilities(collect([$map])),
            'utilityCoordinates' => $this->utilityService->getUtilityCoordinates($map),
            'teams' => TeamResource::collection($teams),
        ]);
    }

    public function layoutOverview()
    {
        $maps = $this->mapService->getMaps();

        return response()->json([
            'maps' => MapResource::collection($maps),
            'maps_count' => $maps->count(),
            'utilities' => $this->utilityService->getUtilities($maps),
            'lineups' => $this->utilityService->getUtilitiesCount(),
        ]);
    }
}
