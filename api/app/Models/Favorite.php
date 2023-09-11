<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'study_log_id'
    ];

    public function studyLog() {
        return $this->belongsTo(StudyLog::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
