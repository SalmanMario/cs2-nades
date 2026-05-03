<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Map extends Model
{
    use SoftDeletes;
    protected $fillable = ['name', 'image', 'map_callouts', 'map_no_callouts'];
}
