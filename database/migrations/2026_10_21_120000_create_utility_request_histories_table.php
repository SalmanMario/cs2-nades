<?php

use App\Enum\UtilityRequestStatusEnum;
use App\Models\User;
use App\Models\UtilityRequest;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('utility_request_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(UtilityRequest::class)->constrained()->cascadeOnDelete();
            // who changed the status: the player when submitting, an admin afterwards
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            $table->enum('status', UtilityRequestStatusEnum::cases());
            $table->timestamps();
        });

        // requests sent before the history existed start with their submission
        DB::table('utility_requests')->orderBy('id')->each(function ($request) {
            DB::table('utility_request_histories')->insert([
                'utility_request_id' => $request->id,
                'user_id' => $request->user_id,
                'status' => UtilityRequestStatusEnum::PENDING->value,
                'created_at' => $request->created_at,
                'updated_at' => $request->created_at,
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_request_histories');
    }
};
