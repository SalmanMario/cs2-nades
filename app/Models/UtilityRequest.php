<?php

namespace App\Models;

use App\Enum\TeamEnum;
use App\Enum\UtilityRequestStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class UtilityRequest extends Model
{
    public const MEDIA_DIRECTORY = 'images/utility-requests';

    protected $fillable = ['user_id', 'map_id', 'utility_type_id', 'team_type', 'grenade_name', 'description', 'source_url', 'media', 'status'];

    protected function casts(): array
    {
        return [
            'team_type' => TeamEnum::class,
            'status' => UtilityRequestStatusEnum::class,
            'media' => 'array',
        ];
    }

    protected static function booted(): void
    {
        // uploaded files are only useful while the request exists
        static::deleted(function (UtilityRequest $utilityRequest) {
            Storage::disk('public')->delete(array_column($utilityRequest->media ?? [], 'filename'));
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function map(): BelongsTo
    {
        return $this->belongsTo(Map::class);
    }

    public function utilityType(): BelongsTo
    {
        return $this->belongsTo(UtilityType::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(UtilityRequestHistory::class)->oldest()->orderBy('id');
    }

    // changes the status and remembers who did it
    public function changeStatus(UtilityRequestStatusEnum $status, User $by): void
    {
        $this->update(['status' => $status]);
        $this->histories()->create(['user_id' => $by->id, 'status' => $status]);
    }

    public function scopePending(Builder $query): void
    {
        $query->where('status', UtilityRequestStatusEnum::PENDING);
    }
}
