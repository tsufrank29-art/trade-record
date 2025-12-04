<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $userId = DB::table('users')->insertGetId([
            'email' => 'demo@example.com',
            'password' => Hash::make('password'),
            'phone' => '0911111111',
            'nickname' => '達人Demo',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $roomId = DB::table('rooms')->insertGetId([
            'owner_user_id' => $userId,
            'name' => 'DEMO 短線房',
            'trading_cycle' => 'short_term',
            'description' => '示範房間',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('room_memberships')->insert([
            'room_id' => $roomId,
            'user_id' => $userId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        for ($i = 0; $i < 10; $i++) {
            DB::table('trade_records')->insert([
                'room_id' => $roomId,
                'stock_code' => '2330',
                'stock_name' => '台積電',
                'shares' => 10 + $i,
                'trade_date' => now()->subDays($i)->toDateString(),
                'action' => $i % 2 === 0 ? 'buy' : 'sell',
                'note' => 'seed trade ' . ($i + 1),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
