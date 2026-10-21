<?php

use App\Enum\TeamEnum;
use App\Enum\UtilityRequestStatusEnum;
use App\Models\Map;
use App\Models\User;
use App\Models\UtilityType;
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
        Schema::create('utility_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Map::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(UtilityType::class)->constrained()->cascadeOnDelete();
            $table->enum('team_type', TeamEnum::cases())->default(TeamEnum::ANY->value);
            $table->string('grenade_name');
            // how to throw it: position, aim, movement, click...
            $table->text('description')->nullable();
            $table->string('source_url', 500)->nullable();
            // uploaded screenshots and video: [{type, filename, path}]
            $table->json('media')->nullable();
            $table->enum('status', UtilityRequestStatusEnum::cases())->default(UtilityRequestStatusEnum::PENDING->value);
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_requests');
    }
};
