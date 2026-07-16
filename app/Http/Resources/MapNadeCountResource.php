<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapNadeCountResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'map_id' => $this->map_id,
            'map_name' => $this->map_name,
            'nades' => NadeCountResource::collection($this->nades),
        ];
    }
}
