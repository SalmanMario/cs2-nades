<?php

namespace Database\Seeders;

use App\Enum\RoleEnum;
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
        User::updateOrCreate(
            ['email' => 'cs2-nades@gmail.com'],
            [
                'name' => 'CS2 Nades',
                'password' => bcrypt('password'),
                'role' => RoleEnum::ADMIN,
                'email_verified_at' => now(),
            ]
        );

        $this->call(MapSeeder::class);
        $this->call(UtilityTypeSeeder::class);
        $this->call(TeamSeeder::class);
    }
}
