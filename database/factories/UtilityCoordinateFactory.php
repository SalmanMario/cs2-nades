<?php

namespace Database\Factories;

use App\Models\EndUtilityCoordinate;
use App\Models\Map;
use App\Models\StartUtilityCoordinate;
use App\Models\UtilityType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UtilityCoordinate>
 */
class UtilityCoordinateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'map_id' => Map::inRandomOrder()->value('id'),
            'start_utility_coordinate_id' => StartUtilityCoordinate::factory(),
            'end_utility_coordinate_id' => EndUtilityCoordinate::factory(),
            'utility_type_id' => UtilityType::inRandomOrder()->value('id'),
        ];
    }
}
