<?php

namespace App\Http\Controllers\Api;

use App\Enum\TeamEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\NadeResource;
use App\Http\Resources\TeamResource;
use App\Models\Utility;
use App\Models\UtilityType;
use App\Models\Team;
use App\Services\MapService;
use App\Services\UtilityService;

class ApiUtilsController extends Controller
{

    public function getNades()
    {
        return NadeResource::collection(UtilityType::all());
    }

    public function getTeams()
    {
        return TeamResource::collection(Team::all());
    }
}
