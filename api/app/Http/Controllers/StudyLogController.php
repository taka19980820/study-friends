<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudyLog;
use Illuminate\Support\Facades\DB;

class StudyLogController extends Controller
{

    public function index() {
        $studyLogs = StudyLog::with([
            'user' => function ($query) {
                $query->select('users.id','name', 'profileimg');
            },
            'myMaterial' => function ($query) {
                $query->select('my_materials.id', 'my_materials.material_id');
            },
            'myMaterial.material' => function ($query) {
                $query->select('materials.id','material_name');
            },
            'comments.user' => function ($query) {
                $query->select('users.id', 'name', 'profileimg');
            },
            'favorites'
        ])->latest('study_date')->get();
        $userId = auth()->id();
        $favoriteIds = DB::table('favorites')
                           ->where('user_id', $userId)
                           ->pluck('study_log_id');
        $studyLogs->each(function($studyLog) use ($favoriteIds) {
            $studyLog->is_liked = $favoriteIds->contains($studyLog->id);
        });
        return response()->json($studyLogs);
    }

    public function show($id) {

        $studyLog = StudyLog::with([
            'user' => function ($query) {
                $query->select('users.id','name');
            },
            'myMaterial.material' => function ($query) {
                $query->select('materials.id','material_name');
            },
        ])->find($id);
        if(!$studyLog) {
            return response()->json(['message' => 'ログが見つかりませんでした。'], 404);
        }
        return response()->json($studyLog);
    }

    public function create(Request $request) {
        $request->validate([
            'my_material_id' => 'required|integer',
            'study_date' => 'required',
            'study_hour' => 'required|integer',
            'memo' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request) {
            //勉強ログテーブルに登録
            $studyLog = new StudyLog();
            $studyLog->study_date = $request->study_date;
            $studyLog->study_hour = $request->study_hour;
            $studyLog->memo = $request->memo;
            $studyLog->my_material_id = $request->my_material_id;
            $studyLog->user_id = auth()->id();

            $studyLog->save();

            return response()->json(['message' => '勉強記録を登録しました。']);
        });
    }

    public function update(StudyLog $studyLog, Request $request) {
        $request->validate([
            'study_date' => 'date',
            'study_hour' => 'nullable|integer',
            'memo' => 'nullable|string'
        ]);
        if ($studyLog->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $studyLog->update([
            'study_date' => $request->study_date ?? $studyLog->study_date,
            'study_hour' => $request->study_hour ?? $studyLog->study_hour,
            'memo' => $request->memo ?? $studyLog->memo
        ]);
        return response()->json(['message' => '更新しました']);

    }

    public function delete(StudyLog $studyLog) {
        if($studyLog->user_id !== auth()->id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }
        $studyLog->delete();
        return response()->json(['message' => '削除しました']);
    }
}
