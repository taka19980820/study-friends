<?php

namespace App\Http\Controllers;

use App\Models\MaterialComment;
use Illuminate\Http\Request;
use App\Libraries\Common;
use App\Models\Material;

class MaterialCommentController extends Controller
{
    private $common;

    public function __construct() {
        $this->common = new Common();
    }

    public function create(Material $material, Request $request) {
        $request->validate([
            'comment' => 'required|string|max:255'
        ]);
        $newData = $material->materialComments()->create([
            'user_id' => auth()->id(),
            'comment' => $request->comment
        ]);
        $res = $newData->load(['user' => function ($query) {
            $query->select('id', 'name');
        }]);
        return response()->json($res, 200);
    }

    public function delete(Material $material, MaterialComment $materialComment, Request $request) {
        $user = $request->user();
        if($user->id !== $materialComment->user_id && !$user->is_admin) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        $materialComment->delete();
        return response()->json(['message' => 'コメントを削除しました']);
    }
}
