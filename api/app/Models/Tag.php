<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag_name'
    ];

    public function users() {
        return $this->belongsToMany(User::class, 'user_tag');
    }

    public function materials() {
        return $this->belongsToMany(Material::class, 'material_tag');
    }

    public function rooms() {
        return $this->belongsToMany(Material::class, 'room_tag');
    }
}
