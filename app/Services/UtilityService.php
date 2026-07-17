<?php

namespace App\Services;

use App\Http\Resources\MapNadeCountResource;
use App\Http\Resources\NadeCountResource;
use App\Http\Resources\UtilityCoordinateResource;
use App\Models\Map;
use App\Models\Utility;
use App\Models\UtilityCoordinate;
use App\Models\UtilityType;

class UtilityService
{
    public function getUtilitiesCount(): int
    {
        return Utility::query()->count();
    }

    public function getNadeTypes(): \Illuminate\Database\Eloquent\Collection|\LaravelIdea\Helper\App\Models\_IH_UtilityType_C|array
    {
        return UtilityType::query()->get(['id', 'name', 'image']);
    }

    public function getNadeCountByMap($maps): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $utilityTypes = $this->getNadeTypes();

        $mapNadeCounts = $maps->map(function ($map) use ($utilityTypes) {
            $counts = $map->utilities
                ->pluck('utilityCoordinates.utility_type_id')
                ->countBy();

            return (object) [
                'map_id' => $map->id,
                'map_name' => $map->name,
                'nades' => $this->nadesWithCounts($utilityTypes, $counts),
            ];
        });

        return MapNadeCountResource::collection($mapNadeCounts);
    }

    public function getUtilities($maps): array
    {
        $utilityTypes = $this->getNadeTypes();

        $counts = $maps
            ->flatMap(fn ($map) => $map->utilities)
            ->pluck('utilityCoordinates.utility_type_id')
            ->countBy();

        return [
            'nades' => NadeCountResource::collection($this->nadesWithCounts($utilityTypes, $counts)),
        ];
    }

    public function getUtilityCoordinates(Map $map): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $utilityCoordinates = UtilityCoordinate::query()
            ->with(['start_utility_coordinates', 'end_utility_coordinates', 'utilities', 'map'])
            ->where('map_id', $map->id)
            ->get();

        return UtilityCoordinateResource::collection($utilityCoordinates);
    }

    private function nadesWithCounts($utilityTypes, $counts)
    {
        return $utilityTypes->map(fn ($type) => (object) [
            'id' => $type->id,
            'name' => $type->name,
            'image' => $type->image,
            'count' => $counts->get($type->id, 0),
        ]);
    }
}
