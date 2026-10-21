<?php

namespace App\Http\Requests;

use App\Enum\TeamEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUtilityRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'grenade_name' => 'required|string|max:120',
            'map_id' => 'required|exists:maps,id',
            'utility_type_id' => 'required|exists:utility_types,id',
            'team_type' => ['required', Rule::enum(TeamEnum::class)],
            'description' => 'nullable|string|max:2000',
            // we need something to look at: a link, screenshots or a video
            'source_url' => 'nullable|url:http,https|max:500|required_without_all:images,video',
            'images' => 'nullable|array|max:2',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'video' => 'nullable|file|mimetypes:video/mp4|max:51200',
        ];
    }

    public function messages(): array
    {
        return [
            'source_url.required_without_all' => 'Add a link, some screenshots or a video so we can check the lineup.',
            'images.max' => 'You can upload up to 2 screenshots.',
            'images.*.max' => 'Each screenshot must be smaller than 5 MB.',
            'video.max' => 'The video must be smaller than 50 MB.',
            'video.mimetypes' => 'The video must be an mp4 file.',
        ];
    }
}
