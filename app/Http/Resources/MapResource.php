<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapResource extends JsonResource
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
            'name' => $this->name,
            'image' => $this->image,
            'map_no_callouts' => $this->map_no_callouts,
            'map_callouts' => $this->map_callouts,
            'number_of_utilities' => $this->utilities->count(),
        ];
    }
}
