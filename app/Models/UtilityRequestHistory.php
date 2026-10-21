<?php

namespace App\Models;

use App\Enum\UtilityRequestStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UtilityRequestHistory extends Model
{
    protected $fillable = ['utility_request_id', 'user_id', 'status'];

    protected function casts(): array
    {
        return [
            'status' => UtilityRequestStatusEnum::class,
        ];
    }

    public function utilityRequest(): BelongsTo
    {
        return $this->belongsTo(UtilityRequest::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
