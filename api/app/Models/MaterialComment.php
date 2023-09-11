<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'comment'
    ];

    public function material() {
        return $this->belongsTo(Material::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    
}
