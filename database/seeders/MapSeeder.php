<?php

namespace Database\Seeders;

use App\Models\Map;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class MapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $maps = [
            'Ancient',
            'Anubis',
            'Dust2',
            'Inferno',
            'Mirage',
            'Nuke',
            'Overpass',
            'Train',
        ];

        $initialPath = File::allFiles('database/seeders/images/maps-img');

        $storagePath = Storage::path('/public/images/maps-img');
        if (!File::exists($storagePath)) {
            File::makeDirectory($storagePath, 0775, true);
        }

        foreach ($initialPath as $image){
            File::copy($image->getPathname(), $storagePath.'/'.$image->getFilename());
        }

        foreach ($maps as $map){
            Map::query()->updateOrCreate([
                'name' => $map,
                'image' => 'images/maps-img/'.$map.'.png'
            ]);
        }
    }
}
