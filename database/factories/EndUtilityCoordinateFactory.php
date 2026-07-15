<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EndUtilityCoordinate>
 */
class EndUtilityCoordinateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'x' => fake()->numberBetween(0, 1024),
            'y' => fake()->numberBetween(0, 1024),
            'title_to' => fake()->sentence(3),
        ];
    }
}
