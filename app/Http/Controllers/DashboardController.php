<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapResource;
use App\Models\Map;

class DashboardController extends Controller
{
    public function index()
    {
        if (\Auth::user()) {
            return response()->json(
                [
                    'message' => 'Welcome to the dashboard',
                    'user' => \Auth::user()
                ]
            );
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    public function getMaps(){
        $maps = Map::query()->withCount('utilities')->get();
        return MapResource::collection($maps);
    }
}
