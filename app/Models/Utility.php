<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Utility extends Model
{
    use softDeletes, HasFactory;
    protected $fillable = ['utility_name', 'technique_type', 'movement_type', 'utility_type_id', 'team_type_id', 'grenade_name', 'map_id', 'utility_coordinate_id', 'team_type', 'team_id', 'key_type', 'notes', 'content_updated_at'];

    // how long a lineup shows the "New" / "Updated" badge
    public const FRESH_DAYS = 14;

    protected function casts(): array
    {
        return [
            'content_updated_at' => 'datetime',
        ];
    }

    // "updated" if an admin marked it as updated recently, otherwise "new" if created recently
    public function freshness(): ?string
    {
        $since = now()->subDays(self::FRESH_DAYS);

        if ($this->content_updated_at?->gte($since)) return 'updated';
        if ($this->created_at?->gte($since)) return 'new';
        return null;
    }

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

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorite_utilities')->withTimestamps();
    }

    public function popular(): HasOne
    {
        return $this->hasOne(PopularUtility::class);
    }

    public function openReports(): HasMany
    {
        return $this->hasMany(UtilityReport::class)->whereNull('resolved_at');
    }

    public function resolveReports(): void
    {
        $this->openReports()->update(['resolved_at' => now()]);
    }
}
