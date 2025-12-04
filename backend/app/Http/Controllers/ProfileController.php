<?php

namespace App\Http\Controllers;

class ProfileController extends Controller
{
    public function me()
    {
        return response()->json([
            'id' => 'current-user',
            'nickname' => '我',
            'email' => 'demo@example.com',
            'roomsCreated' => [
                ['id' => 'room-new', 'name' => '我的房間'],
            ],
            'roomsJoined' => [
                ['id' => 'room-1', 'name' => '短線波段房', 'creatorNickname' => '達人A'],
            ],
        ]);
    }

    public function created()
    {
        return response()->json([
            ['id' => 'room-new', 'name' => '我的房間'],
        ]);
    }

    public function joined()
    {
        return response()->json([
            ['id' => 'room-1', 'name' => '短線波段房', 'creatorNickname' => '達人A'],
        ]);
    }
}
