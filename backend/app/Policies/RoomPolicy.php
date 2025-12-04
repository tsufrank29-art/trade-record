<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Room;

class RoomPolicy
{
    public function manage(User $user, Room $room): bool
    {
        return $user->id === $room->owner_user_id;
    }
}
