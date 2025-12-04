<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TradeRecord;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index(TradeRecord $trade)
    {
        return response()->json([
            'comments' => [
                [
                    'id' => 'comment-1',
                    'content' => '感謝分享！',
                    'author' => ['id' => 'user-3', 'nickname' => '投資人B'],
                    'createdAt' => '2024-02-02T03:00:00+08:00',
                ],
            ],
            'total' => 1,
        ]);
    }

    public function store(Request $request, TradeRecord $trade)
    {
        return response()->json([
            'id' => 'comment-new',
            'content' => $request->input('content'),
            'author' => ['id' => 'current-user', 'nickname' => '我'],
            'createdAt' => now()->toIso8601String(),
        ], 201);
    }
}
