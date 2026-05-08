<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UtilityCoordinate extends Model
{
    protected $fillable = ['start_utility_coordinate_id', 'end_utility_coordinate_id', 'utility_type_id', 'map_id'];

    public function start_utility_coordinates()
    {
        return $this->belongsTo(StartUtilityCoordinate::class, 'start_utility_coordinate_id');
    }
    public function end_utility_coordinates()
    {
        return $this->belongsTo(EndUtilityCoordinate::class, 'end_utility_coordinate_id');
    }

    public function utilities()
    {
        return $this->hasOne(Utility::class, 'utility_coordinate_id');
    }

    public function utility_type()
    {
        return $this->belongsTo(UtilityType::class, 'utility_type_id');
    }
}
