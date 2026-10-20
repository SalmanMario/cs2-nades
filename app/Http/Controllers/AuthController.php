<?php

namespace App\Http\Controllers;

use App\Enum\RoleEnum;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        if (!$email || !$password) {
            return response()->json(['message' => 'Email and password are required'], 400);
        }

        if (!\Auth::attempt(['email' => $email, 'password' => $password])) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => \Auth::user()
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'role' => RoleEnum::GUEST,
        ]);

        \Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Registered successfully',
            'user' => $user,
        ], 201);
    }

    public function logout(Request $request)
    {
        \Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
