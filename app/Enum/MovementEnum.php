<?php

namespace App\Enum;

enum MovementEnum : string
{
    case STATIONARY = 'STATIONARY';
    case WALKING = 'WALKING';
    case RUNNING = 'RUNNING';
    case JUMPING = 'JUMPING';
    case CROUCHING = 'CROUCHING';
    case CROUCHED_WALKING = 'CROUCHED_WALKING';
}
