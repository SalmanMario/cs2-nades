<?php

namespace App\Http\Resources;

use App\Enum\AttachmentType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilityResource extends JsonResource
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
            'team_type' => $this->team->name,
            'team_type_id' => $this->team_id,
            'team_image' => $this->team->image,
            'utility_type' => $this->utilityCoordinates?->utility_type?->name,
            'utility_type_id' => $this->utilityCoordinates?->utility_type_id,
            'utility_image' => $this->utilityCoordinates?->utility_type?->image,
            'start_coords_x' => $this->utilityCoordinates?->start_utility_coordinates?->x,
            'start_coords_y' => $this->utilityCoordinates?->start_utility_coordinates?->y,
            'start_coords_title_from' => $this->utilityCoordinates?->start_utility_coordinates?->title_from,
            'end_coords_x' => $this->utilityCoordinates?->end_utility_coordinates?->x,
            'end_coords_y' => $this->utilityCoordinates?->end_utility_coordinates?->y,
            'end_coords_title_to' => $this->utilityCoordinates?->end_utility_coordinates?->title_to,
            'technique_type' => $this->technique_type,
            'movement_type' => $this->movement_type,
            'image_lineup' => $this->attachments->where('type', AttachmentType::IMAGE_LINEUP->value),
            'video_lineup' => $this->attachments->where('type', AttachmentType::VIDEO_LINEUP->value),
        ];
    }
}
