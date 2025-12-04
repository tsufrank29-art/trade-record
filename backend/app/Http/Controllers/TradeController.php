<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TradeRecord;
use App\Models\Room;

class TradeController extends Controller
{
    public function index(Room $room)
    {
        return response()->json([
            [
                'id' => 'trade-1',
                'symbol' => '2330',
                'name' => '台積電',
                'shares' => 10,
                'date' => '2024-02-01',
                'action' => 'buy',
                'note' => '看好 AI 需求',
            ],
        ]);
    }

    public function store(Request $request, Room $room)
    {
        return response()->json([
            'id' => 'trade-new',
            'symbol' => $request->input('symbol'),
            'name' => $request->input('name'),
            'shares' => $request->input('shares'),
            'date' => $request->input('date'),
            'action' => $request->input('action'),
            'note' => $request->input('note'),
        ], 201);
    }

    public function update(Request $request, Room $room, TradeRecord $trade)
    {
        return response()->json([
            'id' => $trade->id ?? 'trade-1',
            'symbol' => $request->input('symbol', $trade->symbol ?? '2330'),
            'name' => $request->input('name', $trade->name ?? '台積電'),
            'shares' => $request->input('shares', $trade->shares ?? 10),
            'date' => $request->input('date', $trade->date ?? '2024-02-01'),
            'action' => $request->input('action', $trade->action ?? 'buy'),
            'note' => $request->input('note', $trade->note ?? ''),
        ]);
    }

    public function destroy(Room $room, TradeRecord $trade)
    {
        return response()->json(null, 204);
    }
}
