<?php

namespace App\Http\Controllers\Api;

use App\Enum\MapEnum;
use App\Enum\NadeEnum;
use App\Enum\TeamEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\SearchResultResource;
use App\Models\Utility;
use Illuminate\Http\Request;

class ApiSearchController extends Controller
{
    public function search(Request $request)
    {
        $words = array_map('strtolower',explode(' ', $request->q));
        $teamArray = array_map(fn($team) => strtolower($team->value), TeamEnum::cases());

        $mapWords = $this->getFromEnum($words, MapEnum::class);
        $teamWords = array_values(array_filter($words, fn($w) => in_array($w, $teamArray)));
        $nadeWords = $this->getFromEnum($words, NadeEnum::class);

        $freeWords = array_values(array_diff($words, $teamWords, $nadeWords, $mapWords));

        $utilities = Utility::query()->with(['map', 'team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])
            ->when(!empty($mapWords), fn($q) => $q->whereHas('map', fn($q2) => $q2->whereIn('name',$mapWords)))
            ->when(!empty($teamWords), fn($q) => $q->whereHas('team', fn($q2) => $q2->whereIn('name', $teamWords)))
            ->when(!empty($nadeWords), fn($q) => $q->whereHas('utilityCoordinates.utility_type', fn($q2) => $q2->whereIn('name', $nadeWords)))
            ->when(!empty($freeWords), function ($sub) use ($freeWords) {
                $concatFreeWords = implode(' ', $freeWords);
                $sub->where('grenade_name', 'LIKE', '%' . $concatFreeWords . '%')
                    ->orWhereHas('utilityCoordinates.start_utility_coordinates', function ($q) use ($concatFreeWords) {
                        $q->where('title_from', 'LIKE', '%' . $concatFreeWords . '%');
                    })
                    ->orWhereHas('utilityCoordinates.end_utility_coordinates', function ($q) use ($concatFreeWords) {
                        $q->where('title_to', 'LIKE', '%' . $concatFreeWords . '%');
                    });
            })
            ->limit(20)
            ->get();
        return response()->json(SearchResultResource::collection($utilities));
    }

    public function searchByMap(Request $request){
        $words = array_map('strtolower',explode(' ', $request->q));
        $mapName = $request->map;
        $teamArray = array_map(fn($team) => strtolower($team->value), TeamEnum::cases());

        $teamWords = array_values(array_filter($words, fn($w) => in_array($w, $teamArray)));
        $nadeWords = $this->getFromEnum($words, NadeEnum::class);

        $freeWords = array_values(array_diff($words, $teamWords, $nadeWords));

        $utilities = Utility::query()->whereHas('map', function ($q) use ($mapName) {
            $q->where('name', $mapName);
        })->with(['map', 'team', 'utilityCoordinates.utility_type', 'utilityCoordinates.start_utility_coordinates', 'utilityCoordinates.end_utility_coordinates', 'attachments'])
            ->when(!empty($teamWords), fn($q) => $q->whereHas('team', fn($q2) => $q2->whereIn('name', $teamWords)))
            ->when(!empty($nadeWords), fn($q) => $q->whereHas('utilityCoordinates.utility_type', fn($q2) => $q2->whereIn('name', $nadeWords)))
            ->when(!empty($freeWords), function ($query) use ($freeWords) {
                $concatFreeWords = implode(' ', $freeWords);
                $query->where(function ($sub) use ($concatFreeWords) {
                    $sub->where('grenade_name', 'LIKE', '%' . $concatFreeWords . '%')
                        ->orWhereHas('utilityCoordinates.start_utility_coordinates', function ($q) use ($concatFreeWords) {
                            $q->where('title_from', 'LIKE', '%' . $concatFreeWords . '%');
                        })
                        ->orWhereHas('utilityCoordinates.end_utility_coordinates', function ($q) use ($concatFreeWords) {
                            $q->where('title_to', 'LIKE', '%' . $concatFreeWords . '%');
                        });
                });
            })
            ->limit(20)
            ->get();
        return response()->json(SearchResultResource::collection($utilities));
    }

    private function getFromEnum($words, $enum)
    {
        $nadeArray = [];
        foreach ($words as $word) {
            $nade = $enum::tryFromAlias(strtoupper($word));
            if ($nade !== null) {
                $nadeArray[] = strtolower($nade->value);
            }
        }
        return $nadeArray;
    }
}
