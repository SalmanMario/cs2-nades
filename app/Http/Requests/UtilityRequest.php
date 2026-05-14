<?php

namespace App\Http\Requests;

use App\Enum\KeyEnum;
use App\Enum\MovementEnum;
use App\Enum\TechniqueEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UtilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'grenade_name' => 'required|string|max:255',
            'team_type_id' => 'required|exists:teams,id',
            'utility_type_id' => 'required|exists:utility_types,id',
            'movement_type' => ['required', Rule::enum(MovementEnum::class)],
            'technique_type' => ['required', Rule::enum(TechniqueEnum::class)],
            'key_type' => ['nullable', Rule::enum(KeyEnum::class)],
            'title_from' => 'required|string|max:255',
            'title_to' => 'required|string|max:255',
            'start_coords_x' => 'nullable|required_without:existing_start_coords_x|numeric|between:0,1024',
            'start_coords_y' => 'nullable|required_without:existing_start_coords_y|numeric|between:0,1024',
            'end_coords_x' => 'nullable|required_without:existing_end_coords_x|numeric|between:0,1024',
            'end_coords_y' => 'nullable|required_without:existing_end_coords_y|numeric|between:0,1024',
            'existing_start_coords_x' => 'nullable|numeric|between:0,1024',
            'existing_start_coords_y' => 'nullable|numeric|between:0,1024',
            'existing_end_coords_x' => 'nullable|numeric|between:0,1024',
            'existing_end_coords_y' => 'nullable|numeric|between:0,1024',
            // TODO REQUIRED BOTH IMAGE AND VIDEO
            'image_lineup' => 'nullable|array|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'video_lineup' => 'nullable|array|mimes:mp4,avi,mov,wmv,flv,mkv|max:8192',
        ];
    }
}
