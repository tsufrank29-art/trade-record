<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        return response()->json([
            'token' => 'jwt-token-placeholder',
            'user' => [
                'id' => 'uuid',
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'nickname' => $request->input('nickname'),
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        return response()->json([
            'token' => 'jwt-token-placeholder',
            'user' => [
                'id' => 'uuid',
                'email' => $request->input('email'),
                'nickname' => 'demo',
            ],
        ]);
    }

    public function logout()
    {
        return response()->json(null, 204);
    }
}
