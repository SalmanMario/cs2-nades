<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attachment extends Model
{
    protected $fillable = ['attachmentable_id', 'attachmentable_type', 'filename', 'type', 'path'];
    use softDeletes;
    public function attachmentable(): MorphTo
    {
        return $this->morphTo();
    }
}
