<?php

namespace App\Models;

use App\Enum\ReportReasonEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UtilityReport extends Model
{
    protected $fillable = ['utility_id', 'user_id', 'reason', 'message', 'resolved_at'];

    protected function casts(): array
    {
        return [
            'reason' => ReportReasonEnum::class,
            'resolved_at' => 'datetime',
        ];
    }

    public function utility(): BelongsTo
    {
        return $this->belongsTo(Utility::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeOpen(Builder $query): void
    {
        $query->whereNull('resolved_at');
    }
}
