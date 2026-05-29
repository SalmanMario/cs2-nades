<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilityCoordinateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'utility_id' => $this->utilities->id,
            'team_id' => $this->utilities->team_id,
            'type' => $this->utility_type->name,
            'image' => $this->utility_type->image,
            'existing_start_coords' => [
                'id' => $this->start_utility_coordinates->id,
                'x' => $this->start_utility_coordinates->x,
                'y' => $this->start_utility_coordinates->y,
                'title' => $this->start_utility_coordinates->title_from
            ],
            'existing_end_coords' => [
                'id' => $this->end_utility_coordinates->id,
                'x' =>  $this->end_utility_coordinates->x,
                'y' => $this->end_utility_coordinates->y,
                'title' => $this->end_utility_coordinates->title_to,
            ],
        ];
    }
}
