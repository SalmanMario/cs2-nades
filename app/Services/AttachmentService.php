<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;

class AttachmentService
{
    public function process(array $data, string $type, Model $attachable)
    {
        foreach ($data as $d) {
            $image = new Attachment();
            $image->fill([
                'attachmentable_id' => $attachable->id,
                'attachmentable_type' => $attachable::class,
                'filename' => $d->getClientOriginalName(),
                'type' => $type,
            ]);
            $image->save();
        }
    }
}
