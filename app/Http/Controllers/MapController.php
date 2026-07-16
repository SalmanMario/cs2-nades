<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapResource;
use App\Http\Resources\NadeResource;
use App\Services\MapService;

class MapController extends Controller
{
    public function __construct(private MapService $mapService){}

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
            'nade_count' => $this->mapService->getNadeCountByMap($maps),
            'utilities' => $this->mapService->getUtilities($maps),
            'utilities_count' => $this->mapService->getUtilitiesCount(),
        ]);
    }

    public function layoutOverview()
    {
        $maps = $this->mapService->getMaps();

        return response()->json([
            'maps' => MapResource::collection($maps),
            'maps_count' => $maps->count(),
            'utilities' => $this->mapService->getUtilities($maps),
            'lineups' => $this->mapService->getUtilitiesCount(),
        ]);
    }
}
