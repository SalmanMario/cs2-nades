<?php

use App\Models\UtilityCoordinate;
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
        Schema::create('utilities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->string('grenade_name', 255);
            $table->foreignIdFor(\App\Models\Map::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(UtilityCoordinate::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\Team::class)->constrained()->cascadeOnDelete();
            $table->enum('key_type', \App\Enum\KeyEnum::cases())->nullable();
            $table->enum('technique_type', \App\Enum\TechniqueEnum::cases());
            $table->enum('movement_type', \App\Enum\MovementEnum::cases());
            $table->longText('notes')->nullable();
            // set only when an admin marks the lineup as updated, unlike updated_at which changes on every save
            $table->timestamp('content_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilities');
    }
};
