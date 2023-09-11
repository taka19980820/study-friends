<?php

namespace App\Http\Controllers;

use App\Models\StudyLog;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function like(StudyLog $studyLog) {
        $res = $studyLog->favorites()->firstOrCreate([
            'user_id' => auth()->id(),
        ]);
        return response()->json($res, 200);
    }

    public function unlike(StudyLog $studyLog) {
        $studyLog->favorites()->where('user_id', auth()->id())->delete();
        $res = $studyLog->favorites()->get();
        return response()->json($res, 200);
    }
}
