<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UtilityCardResource;
use App\Models\PopularUtility;
use App\Models\Utility;

class ApiPopularUtilityController extends Controller
{
    public function index()
    {
        $popular = Utility::query()
            ->whereHas('popular')
            ->with([
                'team',
                'map',
                'attachments',
                'utilityCoordinates.utility_type',
                'utilityCoordinates.start_utility_coordinates',
                'utilityCoordinates.end_utility_coordinates',
            ])
            ->withCount('favoritedBy')
            ->withExists('openReports')
            // most recently marked as popular first
            ->orderByDesc(
                PopularUtility::query()->select('created_at')->whereColumn('utility_id', 'utilities.id')
            )
            ->get();

        return response()->json(UtilityCardResource::collection($popular));
    }
}
