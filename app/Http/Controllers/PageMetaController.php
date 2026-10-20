<?php

namespace App\Http\Controllers;

use App\Enum\AttachmentType;
use App\Models\Map;
use App\Models\Utility;
use Illuminate\Support\Str;

/**
 * Serves the SPA with page-specific meta tags, so links shared in Discord & co. show a preview.
 * Crawlers don't run JavaScript, so these tags have to be in the HTML Laravel returns.
 */
class PageMetaController extends Controller
{
    public function map(string $mapName)
    {
        $map = Map::where('name', $mapName)->first();

        if (!$map) {
            return view('app');
        }

        $count = Utility::where('map_id', $map->id)->count();

        return view('app', ['meta' => [
            'title' => "{$map->name} Lineups",
            'description' => "{$count} " . Str::plural('lineup', $count) . " for {$map->name} in CS2: smokes, flashes, molotovs and HE grenades.",
            'image' => $map->map_card_image ?? $map->image,
        ]]);
    }

    public function utility(string $mapName, string $utilityId)
    {
        $map = Map::where('name', $mapName)->first();
        $utility = $map ? Utility::with([
            'team',
            'attachments',
            'utilityCoordinates.utility_type',
            'utilityCoordinates.start_utility_coordinates',
            'utilityCoordinates.end_utility_coordinates',
        ])->where('map_id', $map->id)->find($utilityId) : null;

        if (!$utility) {
            return view('app');
        }

        $coordinates = $utility->utilityCoordinates;
        $type = Str::headline(strtolower($coordinates->utility_type->name));
        $side = match ($utility->team->name) {
            'T' => 'T side',
            'CT' => 'CT side',
            default => 'either side',
        };
        $technique = Str::headline(strtolower($utility->technique_type));
        $movement = Str::headline(strtolower($utility->movement_type));

        $description = "{$type} lineup on {$map->name} for {$side}. {$technique}, {$movement}.";
        if ($utility->notes) {
            $description .= ' ' . Str::limit(Str::squish($utility->notes), 120);
        }

        $image = $utility->attachments
            ->where('type', AttachmentType::IMAGE_LINEUP->value)
            ->sortBy('order')
            ->first()?->path;

        return view('app', ['meta' => [
            'title' => "{$map->name} {$type}: {$coordinates->start_utility_coordinates->title_from} to {$coordinates->end_utility_coordinates->title_to}",
            'description' => $description,
            'image' => $image ?? $map->map_card_image ?? $map->image,
        ]]);
    }
}
