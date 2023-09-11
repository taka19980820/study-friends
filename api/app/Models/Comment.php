<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'comment'
    ];

    public function studyLog() {
        return $this->belongsTo(StudyLog::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
