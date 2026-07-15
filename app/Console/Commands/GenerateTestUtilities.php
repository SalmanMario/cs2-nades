<?php

namespace App\Console\Commands;

use App\Models\Utility;
use Illuminate\Console\Command;

class GenerateTestUtilities extends Command
{
    protected $signature = 'utility:generate-test {count=10 : How many test utilities to generate}';

    protected $description = 'Generate fake Utility records (with Map, Team, UtilityCoordinate, UtilityType, etc.) for local testing';

    public function handle(): int
    {
        $count = (int) $this->argument('count');

        $utilities = Utility::factory()->count($count)->create();

        $this->info("Created {$utilities->count()} test utilities:");

        $this->table(
            ['ID', 'Grenade', 'Map', 'Team', 'Technique', 'Movement'],
            $utilities->map(fn (Utility $utility) => [
                $utility->id,
                $utility->grenade_name,
                $utility->map->name,
                $utility->team->name,
                $utility->technique_type,
                $utility->movement_type,
            ])
        );

        return self::SUCCESS;
    }
}