<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        if (\Auth::user()) {
            return response()->json(
                [
                    'message' => 'Welcome to the dashboard',
                    'user' => \Auth::user()
                ]
            );
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
}
