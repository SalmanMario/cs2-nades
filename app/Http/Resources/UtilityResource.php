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
            'start_coords' => [
                "x" => $this->utilityCoordinates?->start_utility_coordinates?->x,
                "y" => $this->utilityCoordinates?->start_utility_coordinates?->y,
                "title" => $this->utilityCoordinates?->start_utility_coordinates?->title_from,
            ],
            'end_coords' => [
                "x" =>  $this->utilityCoordinates?->end_utility_coordinates?->x,
                "y" => $this->utilityCoordinates?->end_utility_coordinates?->y,
                "title" => $this->utilityCoordinates?->end_utility_coordinates?->title_to,
            ],
            'technique_type' => $this->technique_type,
            'movement_type' => $this->movement_type,
            'image_lineup' => $this->attachments->where('type', AttachmentType::IMAGE_LINEUP->value),
            'video_lineup' => $this->attachments->where('type', AttachmentType::VIDEO_LINEUP->value),
        ];
    }
}
