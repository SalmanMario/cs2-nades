<?php

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
        Schema::create('start_utility_coordinates', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('x');
            $table->string('y');
            $table->string('title_from');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('start_utility_coordinates');
    }
};
