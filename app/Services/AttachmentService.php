<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

class AttachmentService
{
    public function process(array $fileIds, string $type, Model $attachable)
    {
        $images = Attachment::whereIn('id', $fileIds)->get();
        foreach ($images as $image) {
            $image->update([
                'type' => $type,
                'attachmentable_id' => $attachable->id,
                'attachmentable_type' => $attachable->getMorphClass(),
            ]);
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
