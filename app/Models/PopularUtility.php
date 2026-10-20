<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PopularUtility extends Model
{
    protected $fillable = ['utility_id'];

    public function utility(): BelongsTo
    {
        return $this->belongsTo(Utility::class);
    }
}
