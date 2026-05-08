<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Utility extends Model
{
    use softDeletes;
    protected $fillable = ['utility_name', 'technique_type', 'movement_type', 'utility_type_id', 'team_type_id', 'grenade_name', 'map_id', 'utility_coordinate_id', 'team_type', 'team_id'];

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'attachmentable_id');
    }

    public function team(): belongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function utilityCoordinates(): belongsTo
    {
        return $this->belongsTo(UtilityCoordinate::class, 'utility_coordinate_id');
    }

    public function map(): belongsTo
    {
        return $this->belongsTo(Map::class, 'map_id');
    }
}
