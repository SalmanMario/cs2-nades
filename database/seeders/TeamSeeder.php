<?php

namespace Database\Seeders;

use App\Enum\TeamEnum;
use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storagePath = storage_path('/app/public/images/teams-img');
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0775, true);
        }

        foreach (TeamEnum::cases() as $team) {
            Team::query()->updateOrCreate([
                'name' => $team->value,
            ], [
                'image' => '/images/teams-img/' . $team->value . '_side.png',
            ]);
        }

        File::copyDirectory('database/seeders/images/teams-img', $storagePath);
    }
}
