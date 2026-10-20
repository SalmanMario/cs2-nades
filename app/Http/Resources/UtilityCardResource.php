<?php

namespace App\Http\Resources;

use App\Enum\AttachmentType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilityCardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $coordinates = $this->utilityCoordinates;

        return [
            'id' => $this->id,
            'title' => $coordinates->start_utility_coordinates->title_from . ' - ' . $coordinates->end_utility_coordinates->title_to,
            'grenade_name' => $this->grenade_name,
            'utility_type' => $coordinates->utility_type->name,
            'utility_image' => $coordinates->utility_type->image,
            'team' => $this->team->name,
            'team_image' => $this->team->image,
            'map_name' => $this->map->name,
            'map_image' => $this->map->image,
            'technique' => $this->technique_type,
            'movement' => $this->movement_type,
            'image' => $this->attachments->where('type', AttachmentType::IMAGE_LINEUP->value)->sortBy('order')->first()?->path,
            'video' => $this->attachments->where('type', AttachmentType::VIDEO_LINEUP->value)->first()?->path,
            // also used for the popular page, where there is no favorites pivot
            'favorited_at' => $this->whenPivotLoaded('favorite_utilities', fn() => $this->pivot->created_at),
            'favorites_count' => $this->whenCounted('favoritedBy'),
        ];
    }
}
