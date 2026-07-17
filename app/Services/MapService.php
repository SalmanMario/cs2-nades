<?php

namespace App\Services;

use App\Models\Map;
use Illuminate\Database\Eloquent\Collection;

class MapService
{
    public function getMaps(): Collection|array
    {
        return Map::query()->with('utilities.utilityCoordinates')->get();
    }

    public function getMap($map): ?Map
    {
        return Map::query()->with('utilities.utilityCoordinates')->where('name', $map)->first();
    }
}
