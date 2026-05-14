<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StartUtilityCoordinate extends Model
{
    protected $fillable = ['x', 'y', 'title_from'];

    public function utility_coordinates() : HasMany{
        return $this->hasMany(UtilityCoordinate::class);
    }
}
