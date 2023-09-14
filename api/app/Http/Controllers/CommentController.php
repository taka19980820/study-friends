<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\StudyLog;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function create(StudyLog $studyLog, Request $request) {
        $request->validate([
            'comment' => 'required|string|max:255'
        ]);
        $newData = $studyLog->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $request->comment
        ]);
        $res = $newData->load(['user' => function ($query) {
            $query->select('id', 'name', 'profileimg');
        }]);
        return response()->json($res, 200);
    }

    public function delete(StudyLog $studyLog, Comment $comment, Request $request) {
        $user = $request->user();
        if($user->id !== $comment->user_id && !$user->is_admin) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        $comment->delete();
        return response()->json(['message' => 'コメントを削除しました']);
    }
}
