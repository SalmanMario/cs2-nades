<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UtilityCoordinate extends Model
{
    use HasFactory;
    protected $fillable = ['start_utility_coordinate_id', 'end_utility_coordinate_id', 'utility_type_id', 'map_id'];

    public function start_utility_coordinates() : belongsTo
    {
        return $this->belongsTo(StartUtilityCoordinate::class, 'start_utility_coordinate_id');
    }
    public function end_utility_coordinates() : belongsTo
    {
        return $this->belongsTo(EndUtilityCoordinate::class, 'end_utility_coordinate_id');
    }

    public function map() : belongsTo
    {
        return $this->belongsTo(Map::class, 'map_id');
    }

    public function utilities() : hasOne
    {
        return $this->hasOne(Utility::class, 'utility_coordinate_id');
    }

    public function utility_type() : belongsTo
    {
        return $this->belongsTo(UtilityType::class, 'utility_type_id');
    }
}
