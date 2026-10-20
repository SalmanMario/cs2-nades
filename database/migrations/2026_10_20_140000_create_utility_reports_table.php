<?php

use App\Enum\ReportReasonEnum;
use App\Models\User;
use App\Models\Utility;
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
        Schema::create('utility_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Utility::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->enum('reason', ReportReasonEnum::cases());
            $table->text('message')->nullable();
            // set when the utility is marked as updated or the report is dismissed
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['utility_id', 'resolved_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_reports');
    }
};
