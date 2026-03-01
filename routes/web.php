<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

Route::get('/getMaps', [\App\Http\Controllers\DashboardController::class, 'getMaps'])->name('getMaps');

Route::view('/{any}', 'app')->where('any', '.*');
