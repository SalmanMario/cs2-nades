<?php

namespace App\Enum;

enum MapEnum: string
{
    case ANCIENT = 'ANCIENT';
    case ANUBIS = 'ANUBIS';
    case DUST_2 = 'DUST2';
    case INFERNO = 'INFERNO';
    case MIRAGE = 'MIRAGE';
    case NUKE = 'NUKE';
    case OVERPASS = 'OVERPASS';
    case TRAIN = 'TRAIN';
    case CACHE = 'CACHE';
    case VERTIGO = 'VERTIGO';

    public static function tryFromAlias(string $value): ?self
    {
        return match (strtoupper($value)) {
            'ANCIENT' => self::ANCIENT,
            'ANUBIS' => self::ANUBIS,
            'DUST_2', 'DUST 2', 'DUST2' => self::DUST_2,
            'INFERNO' => self::INFERNO,
            'MIRAGE' => self::MIRAGE,
            'NUKE' => self::NUKE,
            'OVERPASS' => self::OVERPASS,
            'TRAIN' => self::TRAIN,
            'CACHE' => self::CACHE,
            'VERTIGO' => self::VERTIGO,
            default => null,
        };
    }
}
