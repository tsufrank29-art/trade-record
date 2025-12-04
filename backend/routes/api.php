<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::get('rooms', [RoomController::class, 'index']);
    Route::post('rooms', [RoomController::class, 'store']);
    Route::get('rooms/mine', [RoomController::class, 'mine']);
    Route::get('rooms/joined', [RoomController::class, 'joined']);
    Route::get('rooms/{room}', [RoomController::class, 'show']);
    Route::post('rooms/{room}/join', [RoomController::class, 'join']);
    Route::post('rooms/{room}/leave', [RoomController::class, 'leave']);
    Route::delete('rooms/{room}', [RoomController::class, 'destroy']);

    Route::get('rooms/{room}/trades', [TradeController::class, 'index']);
    Route::post('rooms/{room}/trades', [TradeController::class, 'store']);
    Route::patch('rooms/{room}/trades/{trade}', [TradeController::class, 'update']);
    Route::delete('rooms/{room}/trades/{trade}', [TradeController::class, 'destroy']);

    Route::get('trades/{trade}/comments', [CommentController::class, 'index']);
    Route::post('trades/{trade}/comments', [CommentController::class, 'store']);

    Route::get('me', [ProfileController::class, 'me']);
    Route::get('me/rooms/created', [ProfileController::class, 'created']);
    Route::get('me/rooms/joined', [ProfileController::class, 'joined']);
});
