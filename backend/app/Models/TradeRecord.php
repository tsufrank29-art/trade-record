<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TradeRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id', 'stock_code', 'stock_name', 'shares', 'trade_date', 'action', 'note',
    ];
}
