<?php

namespace App\Http\Resources;

use App\Models\UtilityType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SimilarUtilitiesResource extends JsonResource
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
            'key_type' => $this->key_type,
            'team' => $this->team->name,
            'team_image' => $this->team->image,
            'map_name' => $this->map->name,
            'map_image' => $this->map->image,
            'grenade_name' => $this->grenade_name,
            'utility_name' => $this->utilityCoordinates->utility_type->name,
            'attachments' => $this->attachments,
        ];
    }
}
