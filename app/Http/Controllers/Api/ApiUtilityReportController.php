<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportUtilityRequest;
use App\Models\UtilityReport;
use App\Models\Utility;

class ApiUtilityReportController extends Controller
{
    public function store(ReportUtilityRequest $request, Utility $utility)
    {
        $alreadyReported = $utility->openReports()->where('user_id', $request->user()->id)->exists();

        if ($alreadyReported) {
            return response()->json(['message' => 'You already reported this lineup.'], 409);
        }

        $utility->openReports()->create([
            'user_id' => $request->user()->id,
            'reason' => $request->validated('reason'),
            'message' => $request->validated('message'),
        ]);

        return response()->json(['message' => 'Thanks! We will review this lineup.'], 201);
    }

    // Admin: utilities with open reports, most recently reported first
    public function flagged()
    {
        $utilities = Utility::query()
            ->whereHas('openReports')
            ->with([
                'map',
                'team',
                'utilityCoordinates.utility_type',
                'utilityCoordinates.start_utility_coordinates',
                'utilityCoordinates.end_utility_coordinates',
                'openReports' => fn($query) => $query->with('user:id,name')->latest(),
            ])
            ->orderByDesc(
                UtilityReport::query()->open()->select('created_at')
                    ->whereColumn('utility_id', 'utilities.id')
                    ->latest()
                    ->limit(1)
            )
            ->get();

        return response()->json($utilities->map(fn(Utility $utility) => [
            'id' => $utility->id,
            'title' => $utility->utilityCoordinates->start_utility_coordinates->title_from . ' - ' . $utility->utilityCoordinates->end_utility_coordinates->title_to,
            'grenade_name' => $utility->grenade_name,
            'utility_type' => $utility->utilityCoordinates->utility_type->name,
            'utility_image' => $utility->utilityCoordinates->utility_type->image,
            'team' => $utility->team->name,
            'team_image' => $utility->team->image,
            'map_name' => $utility->map->name,
            'map_image' => $utility->map->image,
            'reports' => $utility->openReports->map(fn(UtilityReport $report) => [
                'id' => $report->id,
                'reason' => $report->reason,
                'message' => $report->message,
                'user_name' => $report->user?->name,
                'created_at' => $report->created_at,
            ]),
        ]));
    }

    // Admin: dismiss all open reports, e.g. when the lineup was fine after all
    public function resolve(Utility $utility)
    {
        $utility->resolveReports();

        return response()->json(['message' => 'Reports dismissed']);
    }
}
