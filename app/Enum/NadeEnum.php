<?php

namespace App\Enum;

enum NadeEnum : string
{
    case FLASH = 'FLASH';
    case SMOKE = 'SMOKE';
    case INCENDIARY = 'INCENDIARY';
    case HE_GRENADE = 'HE_GRENADE';

    public static function tryFromAlias(string $value): ?self
    {
        return match (strtoupper($value)) {
            'FLASH', 'FLASHBANG' => self::FLASH,
            'SMOKE' => self::SMOKE,
            'INCENDIARY', 'MOLOTOV' => self::INCENDIARY,
            'HE_GRENADE', 'HE', 'GRENADE' => self::HE_GRENADE,
            default => null
        };
    }
}
