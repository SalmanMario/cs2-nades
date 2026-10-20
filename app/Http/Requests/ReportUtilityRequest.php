<?php

namespace App\Http\Requests;

use App\Enum\ReportReasonEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportUtilityRequest extends FormRequest
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
            'reason' => ['required', Rule::enum(ReportReasonEnum::class)],
            'message' => 'nullable|string|max:1000',
        ];
    }
}
