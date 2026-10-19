<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FavoriteUtilityResource;
use App\Models\Utility;
use Illuminate\Http\Request;

class ApiFavoriteUtilityController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()->favoriteUtilities()
            ->with([
                'team',
                'map',
                'attachments',
                'utilityCoordinates.utility_type',
                'utilityCoordinates.start_utility_coordinates',
                'utilityCoordinates.end_utility_coordinates',
            ])
            ->latest('favorite_utilities.created_at')
            ->get();

        return response()->json(FavoriteUtilityResource::collection($favorites));
    }

    public function ids(Request $request)
    {
        return response()->json($request->user()->favoriteUtilities()->pluck('utilities.id'));
    }

    public function toggle(Request $request, Utility $utility)
    {
        $result = $request->user()->favoriteUtilities()->toggle($utility->id);

        return response()->json([
            'utility_id' => $utility->id,
            'is_favorite' => count($result['attached']) > 0,
        ]);
    }
}
