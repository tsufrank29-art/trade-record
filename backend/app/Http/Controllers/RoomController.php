<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            [
                'id' => 'room-1',
                'name' => '短線波段房',
                'creator' => ['id' => 'user-2', 'nickname' => '達人A'],
                'memberCount' => 88,
                'cycle' => 'short_term',
                'recentTrades' => [
                    ['symbol' => '2330', 'name' => '台積電', 'date' => '2024-02-01'],
                    ['symbol' => '2317', 'name' => '鴻海', 'date' => '2024-01-30'],
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        return response()->json([
            'id' => 'room-new',
            'name' => $request->input('name'),
            'cycle' => $request->input('cycle'),
            'intro' => $request->input('intro'),
            'memberCount' => 1,
        ], 201);
    }

    public function mine()
    {
        return response()->json([
            'rooms' => [
                ['id' => 'room-new', 'name' => '我的房間', 'memberCount' => 2, 'cycle' => 'mid_term'],
            ],
            'hasRoom' => true,
        ]);
    }

    public function joined()
    {
        return response()->json([
            ['id' => 'room-1', 'name' => '短線波段房', 'creator' => ['id' => 'user-2', 'nickname' => '達人A'], 'memberCount' => 88, 'cycle' => 'long_term'],
        ]);
    }

    public function show(Room $room)
    {
        return response()->json([
            'id' => $room->id ?? 'room-1',
            'name' => $room->name ?? '短線波段房',
            'memberCount' => 90,
            'cycle' => 'value_inv',
            'intro' => '價值投資分享',
            'creator' => ['id' => 'user-2', 'nickname' => '達人A'],
            'tradeRecords' => [],
        ]);
    }

    public function join(Room $room)
    {
        return response()->json(['status' => 'joined']);
    }

    public function leave(Room $room)
    {
        return response()->json(['status' => 'left']);
    }

    public function destroy(Room $room)
    {
        return response()->json(null, 204);
    }
}
