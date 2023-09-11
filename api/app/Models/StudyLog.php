<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'my_material_id',
        'user_id',
        'study_date',
        'study_hour',
        'memo'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function myMaterial() {
        return $this->belongsTo(MyMaterial::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function favorites() {
        return $this->hasMany(Favorite::class);
    }
}
