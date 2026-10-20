<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UtilityCardResource;
use App\Models\Utility;

class ApiLatestUtilityController extends Controller
{
    private const LIMIT = 60;

    public function index()
    {
        $latest = Utility::query()
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
            // newest of "created" and "marked as updated" first
            ->orderByRaw('GREATEST(created_at, COALESCE(content_updated_at, created_at)) DESC')
            ->limit(self::LIMIT)
            ->get();

        return response()->json(UtilityCardResource::collection($latest));
    }
}
