<?php

namespace App\Enum;

enum ReportReasonEnum: string
{
    case OUTDATED = "OUTDATED";
    case WRONG_NAME = "WRONG_NAME";
    case WRONG_LINEUP = "WRONG_LINEUP";
    case BROKEN_MEDIA = "BROKEN_MEDIA";
    case OTHER = "OTHER";
}
