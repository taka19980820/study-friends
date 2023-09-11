<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\StudyLog;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{

    public function index(Request $request) {
        $query = Room::query();
        if($request->has('keyword')) {
            $keyword = $request->keyword;
            $query->where('room_name', 'like', "%{$keyword}%");
        }
        if($request->has('tags')) {
            $tags = explode(',', $request->tags);
            $query->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_name', $tags);
            });
        }
        $rooms = $query->with([
            'tags' => function ($query) {
                $query->select('tags.id', 'tags.tag_name');
            },
            'users' => function ($query) {
                $query->select('users.id', 'users.name');
            }
        ])->latest('updated_at')->get();
        $userId = auth()->id();
        $rooms->each(function($room) use ($userId) {
            $room->is_join = $room->users->contains('id', $userId);
            $adminUser = $room->users->firstWhere('id', $room->user_id);
            $room->admin_user = $adminUser->name;
        });

        return response()->json($rooms);
    }

    public function show(Room $room) {
        if(!$room->users->contains(auth()->id()) && !auth()->user()->is_admin) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        $room->load([
            'tags', 
            'users' => function($query) {
                $query->select('users.id', 'users.name');
            }
        ]);
        $userId = auth()->id();
        $room->is_join = $room->users->contains('id', $userId);
        $adminUser = $room->users->firstWhere('id', $room->user_id);
        $room->admin_user = $adminUser->name;
        $studyLogs = StudyLog::with([
            'user' => function ($query) {
                $query->select('users.id','name');
            },
            'myMaterial' => function ($query) {
                $query->select('my_materials.id', 'my_materials.material_id');
            },
            'myMaterial.material' => function ($query) {
                $query->select('materials.id','material_name');
            },
            'comments.user' => function ($query) {
                $query->select('users.id', 'name');
            },
            'favorites'
        ])
        ->whereIn('user_id', $room->users->pluck('id'))
        ->latest('study_date')
        ->get();
        $favoriteIds = DB::table('favorites')
                           ->where('user_id', $userId)
                           ->pluck('study_log_id');
        $studyLogs->each(function($studyLog) use ($favoriteIds) {
            $studyLog->is_liked = $favoriteIds->contains($studyLog->id);
        });
        return response()->json([
            'room' => $room,
            'studyLogs' => $studyLogs
        ]);
    }

    public function joinRoom(Room $room, Request $request) {
        $user = $request->user();
        $room->users()->sync([$user->id], false);
        return response()->json(['message'=> 'ルームに参加しました']);
    }

    public function exitRoom(Room $room, Request $request) {
        $user = $request->user();
        $room->users()->detach($user->id);
        return response()->json(['message'=> 'ルームを退出しました']);
    }

    public function create(Request $request) {
        $request->validate([
            "room_name" => "required|string|max:255",
            "description" => "required|string",
            'tags' => 'array',
            'tags.*' => 'string'
        ]);

        return DB::transaction(function () use ($request) {            
            $response = $room = Room::create([
                'room_name' => $request->room_name,
                'description' => $request->description,
                'user_id' => auth()->id(),
            ]);

            $room->users()->sync(auth()->id());

            //タグ更新
            $tagNames = $request->tags ?? [];
            $tagIds = [];
    
            foreach($tagNames as $tagName) {
                $tag = Tag::firstOrCreate(['tag_name' => $tagName]);
                $tagIds[] = $tag->id;
            }
    
            $room->tags()->sync($tagIds);
            return response()->json($response, 200);
        });
    }

    public function update(Request $request, Room $room) {
        $request->validate([
            "room_name" => "string|max:255",
            "description" => "string",
            'tags' => 'array',
            'tags.*' => 'string'
        ]);

        if (auth()->id() !== $room->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        return DB::transaction(function () use ($request, $room) {
            $room->update([
                'room_name' => $request->room_name ?? $room->room_name,
                'description' => $request->description ?? $room->description
            ]);

            //タグ更新
            $tagNames = $request->tags ?? [];
            $tagIds = [];
    
            foreach($tagNames as $tagName) {
                $tag = Tag::firstOrCreate(['tag_name' => $tagName]);
                $tagIds[] = $tag->id;
            }
    
            $room->tags()->sync($tagIds);
            return response()->json(['message' => 'ルーム情報を更新しました。']);
        });
    }

    public function delete(Request $request, Room $room) {
        if (auth()->id() !== $room->user_id && !$request->user()->is_admin) {
            return response()->json(['message' => '権限がありません'], 403);
        }
        $room->delete();
        return response()->json(['message' => 'ルームを削除しました']);
    }

}
