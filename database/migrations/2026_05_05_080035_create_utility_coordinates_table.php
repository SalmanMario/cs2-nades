<?php

use App\Models\EndUtilityCoordinate;
use App\Models\StartUtilityCoordinate;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('utility_coordinates', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
//            $table->foreignIdFor(\App\Models\Map::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(StartUtilityCoordinate::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(EndUtilityCoordinate::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\UtilityType::class)->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_coordinates');
    }
};
