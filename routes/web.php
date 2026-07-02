<?php

use App\Http\Controllers\Api\ApiAttachmentController;
use App\Http\Controllers\Api\ApiUtilsController;
use App\Http\Controllers\UtilityController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

Route::get('/getMaps', [\App\Http\Controllers\DashboardController::class, 'getMaps'])->name('getMaps');
Route::get('/getNades', [ApiUtilsController::class, 'getNades'])->name('getNades');
Route::get('/getTeams', [ApiUtilsController::class, 'getTeams'])->name('getTeams');
Route::get('/getUtilityStats', [ApiUtilsController::class, 'getUtilityStats'])->name('getUtilityStats');
Route::post('/getSimilarUtilitiesByCoords/{mapId}', [ApiUtilsController::class, 'getSimilarUtilitiesByCoords'])->name('getSimilarUtilitiesByCoords');
Route::get('/getUtility/{map}/{id}', [ApiUtilsController::class, 'getUtility'])->name('getUtility');
Route::get('/getUtilityCoordinates/{mapName}', [ApiUtilsController::class, 'getUtilityCoordinates'])->name('getUtilityCoordinates');
Route::get('/getMap/{map}', [ApiUtilsController::class, 'getMap'])->name('getMap');
Route::post('/attachment/upload', [ApiAttachmentController::class, 'store'])->name('attachment.store');
Route::get('/attachment/{attachment}', [ApiAttachmentController::class, 'show'])->name('attachment.show');

Route::get('/utilities/{mapName}', [UtilityController::class, 'index']);
Route::resource('utilities', UtilityController::class)->except('index');

Route::view('/{any}', 'app')->where('any', '.*');
