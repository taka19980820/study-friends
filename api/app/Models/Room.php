<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_name',
        'description',
        'user_id',
        'room_icon'
    ];

    public function tags() {
        return $this->belongsToMany(Tag::class, 'room_tag');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'room_user');
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }
}
