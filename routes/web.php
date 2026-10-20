<?php

use App\Http\Controllers\Api\ApiAttachmentController;
use App\Http\Controllers\Api\ApiFavoriteUtilityController;
use App\Http\Controllers\Api\ApiSearchController;
use App\Http\Controllers\Api\ApiUtilityController;
use App\Http\Controllers\Api\ApiUtilsController;
use App\Http\Controllers\UtilityController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register'])->name('register');
});
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

// Backend only: ADMIN users
Route::middleware('admin')->group(function () {
    Route::get('/getUtilityStats', [ApiUtilityController::class, 'getUtilityStats'])->name('getUtilityStats');
    Route::post('/attachment/upload', [ApiAttachmentController::class, 'store'])->name('attachment.store');
    Route::post('/attachment/reorder', [ApiAttachmentController::class, 'reorder'])->name('attachment.reorder');
    Route::get('/attachment/{attachment}', [ApiAttachmentController::class, 'show'])->name('attachment.show');
    Route::get('/backend-map-overview/{mapName}', [\App\Http\Controllers\MapController::class, 'backendMapOverview'])->name('backendMapOverview');
    Route::resource('utilities', UtilityController::class)->except('index');
    Route::get('/flagged-utilities', [\App\Http\Controllers\Api\ApiUtilityReportController::class, 'flagged'])->name('flaggedUtilities.index');
    Route::post('/flagged-utilities/{utility}/dismiss', [\App\Http\Controllers\Api\ApiUtilityReportController::class, 'resolve'])->name('flaggedUtilities.dismiss');
});

// Any logged-in user (ADMIN or GUEST)
Route::middleware('auth')->group(function () {
    Route::get('/favorites', [ApiFavoriteUtilityController::class, 'index'])->name('favorites.index');
    Route::get('/favorites/ids', [ApiFavoriteUtilityController::class, 'ids'])->name('favorites.ids');
    Route::post('/favorites/{utility}', [ApiFavoriteUtilityController::class, 'toggle'])->name('favorites.toggle');
    Route::post('/utilities/{utility}/reports', [\App\Http\Controllers\Api\ApiUtilityReportController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('utilityReports.store');
    Route::put('/profile',[\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [\App\Http\Controllers\ProfileController::class, 'updatePassword'])
        ->middleware('throttle:5,1')
        ->name('profile.password');
});

Route::get('/latest-utilities', [\App\Http\Controllers\Api\ApiLatestUtilityController::class, 'index'])->name('latestUtilities.index');
Route::get('/popular-utilities',[\App\Http\Controllers\Api\ApiPopularUtilityController::class, 'index'])->name('popularUtilities.index');
Route::get('/getNades',[ApiUtilsController::class, 'getNades'])->name('getNades');
Route::get('/getTeams', [ApiUtilsController::class, 'getTeams'])->name('getTeams');
Route::get('/getUtilityCoordinates/{mapName}', [ApiUtilityController::class, 'getUtilityCoordinates'])->name('getUtilityCoordinates');
Route::get('/search', [ApiSearchController::class, 'search'])->name('search');
Route::get('/search-by-map', [ApiSearchController::class, 'searchByMap'])->name('searchByMap');

Route::get('/getMap/{map}', [\App\Http\Controllers\MapController::class, 'getMap'])->name('getMap');
Route::get('/getMaps', [\App\Http\Controllers\MapController::class, 'maps'])->name('getMaps');
Route::get('/mapsOverview', [\App\Http\Controllers\MapController::class, 'mapsOverview'])->name('mapsOverview');
Route::get('/mapOverview', [\App\Http\Controllers\MapController::class, 'mapOverview'])->name('mapOverview');
Route::get('/layoutOverview', [\App\Http\Controllers\MapController::class, 'layoutOverview'])->name('layoutOverview');

Route::get('/getUtility/{map}/{id}', [ApiUtilityController::class, 'getUtility'])->name('getUtility');
Route::post('/getSimilarUtilitiesByCoords/{mapId}', [ApiUtilityController::class, 'getSimilarUtilitiesByCoords'])->name('getSimilarUtilitiesByCoords');

Route::view('/{any}', 'app')->where('any', '.*');
