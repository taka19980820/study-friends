<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\StudyLog;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Libraries\Common;
use Illuminate\Support\Facades\File;

class RoomController extends Controller
{
    private $common;
    public function __construct() {
        $this->common = new Common();
    }

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
                $query->select('users.id', 'users.name', 'profileimg');
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
                $query->select('users.id', 'users.name', 'profileimg');
            }
        ]);
        $userId = auth()->id();
        $room->is_join = $room->users->contains('id', $userId);
        $adminUser = $room->users->firstWhere('id', $room->user_id);
        $room->admin_user = $adminUser->name;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'tags' => 'array',
            'tags.*' => 'string'
        ]);

        //画像保存
        $roomIconImgPath = '';
        $image = $request->file('image');
        if(isset($image)) {
            try {
                $roomIconImgPath = $this->common->getSavedImgPath($image, 250, 250, 'uploads/images/roomicons/');
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }

        return DB::transaction(function () use ($request, $roomIconImgPath) {            
            $response = $room = Room::create([
                'room_name' => $request->room_name,
                'description' => $request->description,
                'room_icon' => $roomIconImgPath != '' ? $roomIconImgPath : null,
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'tags' => 'array',
            'tags.*' => 'string'
        ]);

        if (auth()->id() !== $room->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        //画像保存
        $roomIconImgPath = '';
        $image = $request->file('image');
        if(isset($image)) {
            var_dump('北で');
            $roomIcon = $room->room_icon;
            try {
                $roomIconImgPath = $this->common->getSavedImgPath($image, 200, 200, 'uploads/images/roomicons/');
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
            if(File::exists($roomIcon)) {
                File::delete($roomIcon);
            }
        }

        return DB::transaction(function () use ($request, $room, $roomIconImgPath) {
            var_dump($roomIconImgPath);
            $room->update([
                'room_name' => $request->room_name ?? $room->room_name,
                'description' => $request->description ?? $room->description,
                'room_icon' => $roomIconImgPath != '' ? $roomIconImgPath : $room->room_icon,
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
