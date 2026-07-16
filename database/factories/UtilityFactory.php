<?php

namespace Database\Factories;

use App\Enum\KeyEnum;
use App\Enum\MovementEnum;
use App\Enum\TechniqueEnum;
use App\Models\Map;
use App\Models\Team;
use App\Models\UtilityCoordinate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Utility>
 */
class UtilityFactory extends Factory
{
    public function definition(): array
    {
        $mapId = Map::inRandomOrder()->value('id');

        return [
            'grenade_name' => fake()->words(2, true),
            'map_id' => $mapId,
            'utility_coordinate_id' => UtilityCoordinate::factory()->state([
                'map_id' => $mapId,
            ]),
            'team_id' => Team::inRandomOrder()->value('id'),
            'key_type' => fake()->optional()->randomElement(KeyEnum::cases())?->value,
            'technique_type' => fake()->randomElement(TechniqueEnum::cases())->value,
            'movement_type' => fake()->randomElement(MovementEnum::cases())->value,
        ];
    }
}
