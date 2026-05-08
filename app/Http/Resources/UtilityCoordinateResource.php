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
            'team_id' => $this->utilities->team_id,
            'id_existing_start_coords' => $this->start_utility_coordinates->id,
            'existing_start_coords_x' => $this->start_utility_coordinates->x,
            'existing_start_coords_y' => $this->start_utility_coordinates->y,
            'id_existing_end_coords' => $this->end_utility_coordinates->id,
            'existing_end_coords_x' => $this->end_utility_coordinates->x,
            'existing_end_coords_y' => $this->end_utility_coordinates->y,
            'title_from' => $this->start_utility_coordinates->title_from,
            'title_to' => $this->end_utility_coordinates->title_to,
        ];
    }
}
