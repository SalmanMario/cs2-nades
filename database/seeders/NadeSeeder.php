<?php

namespace Database\Seeders;

use App\Enum\NadeEnum;
use App\Models\Nade;
use Illuminate\Database\Seeder;

class NadeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (NadeEnum::cases() as $nade) {
            Nade::query()->updateOrCreate([
                'name' => $nade->value,
            ]);
        }
    }
}
