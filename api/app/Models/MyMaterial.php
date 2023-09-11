<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyMaterial extends Model
{
    use HasFactory;

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function material() {
        return $this->belongsTo(Material::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function studyLogs() {
        return $this->hasMany(StudyLog::class);
    }
}
