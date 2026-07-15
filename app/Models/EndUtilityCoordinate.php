<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EndUtilityCoordinate extends Model
{
    use HasFactory;
    protected $fillable = ['x', 'y', 'title_to'];

    public function utility_coordinates() : HasMany{
        return $this->hasMany(UtilityCoordinate::class);
    }
}
