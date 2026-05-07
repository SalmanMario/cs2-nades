<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UtilityType extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'image'];
}
