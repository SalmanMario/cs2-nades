<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasswordRequest;
use App\Http\Requests\ProfileRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function update(ProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function updatePassword(PasswordRequest $request)
    {
        $user = $request->user();
        $user->password = $request->validated('password');
        // invalidates any "remember me" cookie on other devices
        $user->setRememberToken(Str::random(60));
        $user->save();

        // log out every other device, keep only the current session
        DB::table(config('session.table'))
            ->where('user_id', $user->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return response()->json(['message' => 'Password updated successfully']);
    }
}
