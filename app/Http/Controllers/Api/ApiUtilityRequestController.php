<?php

namespace App\Http\Controllers\Api;

use App\Enum\UtilityRequestStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUtilityRequestRequest;
use App\Models\Attachment;
use App\Models\Team;
use App\Models\UtilityRequest;
use App\Models\UtilityRequestHistory;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ApiUtilityRequestController extends Controller
{
    // max requests a user can have waiting for review
    private const MAX_PENDING = 10;

    // Lineups the logged-in user asked for, with their status
    public function mine(Request $request)
    {
        $requests = UtilityRequest::query()
            ->where('user_id', $request->user()->id)
            ->with(['map', 'utilityType', 'histories.user:id,name'])
            ->latest()
            ->get();

        return response()->json($requests->map(fn(UtilityRequest $utilityRequest) => $this->toArray($utilityRequest)));
    }

    public function store(StoreUtilityRequestRequest $request)
    {
        $pending = UtilityRequest::query()->pending()->where('user_id', $request->user()->id)->count();

        if ($pending >= self::MAX_PENDING) {
            return response()->json(['message' => 'You already have ' . self::MAX_PENDING . ' requests waiting for review, please wait until we check them.'], 429);
        }

        $media = [];
        foreach ($request->file('images', []) as $image) {
            $media[] = $this->storeFile($image, 'image');
        }
        if ($request->hasFile('video')) {
            $media[] = $this->storeFile($request->file('video'), 'video');
        }

        $utilityRequest = UtilityRequest::query()->create([
            ...$request->safe()->only(['grenade_name', 'map_id', 'utility_type_id', 'team_type', 'description', 'source_url']),
            'user_id' => $request->user()->id,
            'media' => $media,
        ]);
        $utilityRequest->histories()->create([
            'user_id' => $request->user()->id,
            'status' => UtilityRequestStatusEnum::PENDING,
        ]);

        return response()->json(['message' => 'Thanks! We will review your lineup soon.'], 201);
    }

    // Admin: all requests, pending first
    public function index()
    {
        $requests = UtilityRequest::query()
            ->with(['map', 'utilityType', 'user:id,name', 'histories.user:id,name'])
            ->orderByRaw('status = ? desc', [UtilityRequestStatusEnum::PENDING->value])
            ->latest()
            ->get();

        return response()->json($requests->map(fn(UtilityRequest $utilityRequest) => [
            ...$this->toArray($utilityRequest),
            'user_name' => $utilityRequest->user?->name,
        ]));
    }

    // Admin: mark as added to the site, rejected, or back to pending
    public function updateStatus(Request $request, UtilityRequest $utilityRequest)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(UtilityRequestStatusEnum::class)],
        ]);

        $status = UtilityRequestStatusEnum::from($validated['status']);
        if ($utilityRequest->status !== $status) {
            $utilityRequest->changeStatus($status, $request->user());
        }

        return response()->json(['message' => 'Request updated']);
    }

    // Admin: values to pre-fill the create lineup form with. The request files are copied
    // as unattached attachments, like FilePond uploads, so the form can load them by id
    public function prefill(UtilityRequest $utilityRequest)
    {
        $attachmentIds = ['image' => [], 'video' => []];

        foreach ($utilityRequest->media ?? [] as $file) {
            if (!Storage::disk('public')->exists($file['filename'])) continue;

            $filename = uniqid() . '.' . pathinfo($file['filename'], PATHINFO_EXTENSION);
            Storage::disk('public')->copy($file['filename'], 'images/utilities-img/' . $filename);

            $attachmentIds[$file['type']][] = Attachment::query()->create([
                'filename' => $filename,
                'path' => '/storage/images/utilities-img/' . $filename,
            ])->id;
        }

        return response()->json([
            'id' => $utilityRequest->id,
            'grenade_name' => $utilityRequest->grenade_name,
            'utility_type_id' => $utilityRequest->utility_type_id,
            'team_type_id' => Team::query()->where('name', $utilityRequest->team_type->value)->value('id'),
            'notes' => $utilityRequest->description,
            'source_url' => $utilityRequest->source_url,
            'image_ids' => $attachmentIds['image'],
            'video_ids' => $attachmentIds['video'],
        ]);
    }

    // Admin
    public function destroy(UtilityRequest $utilityRequest)
    {
        $utilityRequest->delete();

        return response()->json(['message' => 'Request deleted']);
    }

    private function storeFile(UploadedFile $file, string $type): array
    {
        $filename = $file->storeAs(UtilityRequest::MEDIA_DIRECTORY, uniqid() . '.' . $file->extension(), 'public');

        return [
            'type' => $type,
            'filename' => $filename,
            'path' => '/storage/' . $filename,
        ];
    }

    private function toArray(UtilityRequest $utilityRequest): array
    {
        return [
            'id' => $utilityRequest->id,
            'grenade_name' => $utilityRequest->grenade_name,
            'team_type' => $utilityRequest->team_type,
            'description' => $utilityRequest->description,
            'source_url' => $utilityRequest->source_url,
            'media' => collect($utilityRequest->media ?? [])->map(fn(array $file) => [
                'type' => $file['type'],
                'path' => $file['path'],
            ])->values(),
            'status' => $utilityRequest->status,
            'map_name' => $utilityRequest->map->name,
            'map_image' => $utilityRequest->map->image,
            'utility_type' => $utilityRequest->utilityType->name,
            'utility_image' => $utilityRequest->utilityType->image,
            'created_at' => $utilityRequest->created_at,
            // oldest first, the first entry is the submission
            'history' => $utilityRequest->histories->map(fn(UtilityRequestHistory $history) => [
                'id' => $history->id,
                'status' => $history->status,
                'user_name' => $history->user?->name,
                'created_at' => $history->created_at,
            ]),
        ];
    }
}
