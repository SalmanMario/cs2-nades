<?php

namespace App\Enum;

enum MovementEnum : string
{
    case STATIONARY = 'STATIONARY';
    case WALKING = 'WALKING';
    case RUNNING = 'RUNNING';
    case JUMPING = 'JUMPING';
    case JUMP_RUNNING = 'JUMP_RUNNING';
    case CROUCHING = 'CROUCHING';
    case CROUCHED_WALKING = 'CROUCHED_WALKING';
    case CROUCHED_JUMPING = 'CROUCHED_JUMPING';
}
