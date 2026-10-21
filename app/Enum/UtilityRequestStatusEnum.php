<?php

namespace App\Enum;

enum UtilityRequestStatusEnum: string
{
    case PENDING = "PENDING";
    case ADDED = "ADDED";
    case REJECTED = "REJECTED";
}
