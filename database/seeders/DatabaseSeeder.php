<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'CS2 Nades',
            'email' => 'cs2-nades@gmail.com',
            'password' => bcrypt('password'),
        ]);

        $this->call(MapSeeder::class);
        $this->call(NadeSeeder::class);
    }
}
