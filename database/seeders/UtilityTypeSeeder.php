<?php

namespace Database\Seeders;

use App\Enum\NadeEnum;
use App\Models\UtilityType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class UtilityTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storagePath = Storage::path('/public/images/nades-img');
        if (!File::exists($storagePath)) {
            File::makeDirectory($storagePath, 0775, true);
        }

        foreach (NadeEnum::cases() as $nade) {
            UtilityType::query()->updateOrCreate([
                'name' => $nade->value,
            ], [
                'image' => '/images/nades-img/'.$nade->value.'.png',
            ]);
        }


        File::copyDirectory('database/seeders/images/nades-img', $storagePath);
    }
}
