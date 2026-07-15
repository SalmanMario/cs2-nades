<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UtilityType extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'image'];

    public function utilitiesCoordinates(): HasMany
    {
        return $this->hasMany(UtilityCoordinate::class);
    }
}
