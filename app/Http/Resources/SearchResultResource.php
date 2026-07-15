<?php

namespace App\Http\Resources;

use App\Enum\AttachmentType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'grenade_name' => $this->grenade_name,
            'team_image' => $this->team->image,
            'team_name' => $this->team->name,
            'map_name' => $this->map->name,
            'map_image' => $this->map->image,
            'utility_name' => $this->utilityCoordinates->utility_type->name,
            'utility_image' => $this->utilityCoordinates->utility_type->image,
            'movement_type' => $this->movement_type,
            'card_image' => $this->attachments->where('type', AttachmentType::IMAGE_LINEUP->value),
        ];
    }
}
