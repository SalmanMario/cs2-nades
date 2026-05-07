<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

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

    public function initFolder($mapName)
    {
        $utilitiesFolder = storage_path('app/public/images/utilities-img');
        if (!File::exists($utilitiesFolder)) {
            File::makeDirectory($utilitiesFolder, 0775, true);
        }

        $utilityMapFolder = "$utilitiesFolder/$mapName";
        if (!File::exists($utilityMapFolder)) {
            File::makeDirectory($utilityMapFolder, 0775, true);
            File::makeDirectory($utilityMapFolder . '/lineups', 0775, true);
            File::makeDirectory($utilityMapFolder . '/videos', 0775, true);
        }
    }
}
