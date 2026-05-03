<?php

use App\Http\Controllers\Api\ApiUtilsController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

Route::get('/getMaps', [\App\Http\Controllers\DashboardController::class, 'getMaps'])->name('getMaps');
Route::get('/getNades', [ApiUtilsController::class, 'getNades'])->name('getNades');
Route::get('/getTeams', [ApiUtilsController::class, 'getTeams'])->name('getTeams');
Route::get('/getMap/{map}', [ApiUtilsController::class, 'getMap'])->name('getMap');

Route::view('/{any}', 'app')->where('any', '.*');
