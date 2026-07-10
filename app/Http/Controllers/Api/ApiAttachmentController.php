<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ApiAttachmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $file = $request->file('image_lineup') ?? $request->file('video_lineup');
            $storagePath = storage_path('app/public/images/utilities-img');
            if (!File::exists($storagePath)) {
                File::makeDirectory($storagePath, 0775, true);
            }

            $fileName = uniqid().'.'.$file->getClientOriginalExtension();
            $file->storeAs('public/images/utilities-img', $fileName);
            $attachment = Attachment::create([
                'filename' => $fileName,
                'path' => '/storage/images/utilities-img/'.$fileName,
            ]);
            return response()->json(['id' => $attachment->id], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reorder(Request $request){
        foreach ($request->ids as $index => $id) {
           Attachment::find($id)->update(['order' => $index]);
        }

        return response()->json(['success' => true]);
    }

    public function show(Attachment $attachment)
    {
        $path = storage_path('app/public/images/utilities-img/' . $attachment->filename);

        return response()->file($path, [
            "Content-Disposition" => "inline; filename=\"{$attachment->filename}\""
        ]);
    }
}
