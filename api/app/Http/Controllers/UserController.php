<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use App\Libraries\Common;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;
use App\Models\Material;
use App\Models\MyMaterial;
use App\Models\StudyLog;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    private $common;

    public function __construct() {
        $this->common = new Common();
    }

    public function index() {
        $users = User::with('tags')->get();
        return new UserCollection($users);
    }

    public function show(User $user) {
        if($user) {
            return new UserResource($user->load('tags'));
        }
        return response()->json(['message' => 'ユーザーが見つかりませんでした。'], 404);
    }

    public function getUserMaterials(User $user) {
        $materials = MyMaterial::with([
            'user' => function ($query) {
                $query->select('users.id', 'name');
            },
            'material.tags',
            'material.materialComments.user' => function ($query) {
                $query->select('users.id', 'name', 'profileimg');
            },
            'material.materialFavorites', 
        ])
        ->where('user_id', $user->id)
        ->orWhereNull('user_id')
        ->latest('updated_at')
        ->get();
        $userId = auth()->id();
        $favoriteIds = DB::table('material_favorites')
                           ->where('user_id', $userId)
                           ->pluck('material_id');
        $materials->each(function($material) use ($favoriteIds) {
            $material->is_liked = $favoriteIds->contains($material->material->id);
        });
        return response()->json($materials);
    }

    public function getUserLogs(User $user) {
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
            ->where('user_id', $user->id)
            ->latest('study_date')
            ->get();
            $userId = auth()->id();
            $favoriteIds = DB::table('favorites')
                           ->where('user_id', $userId)
                           ->pluck('study_log_id');
            $studyLogs->each(function($studyLog) use ($favoriteIds) {
                $studyLog->is_liked = $favoriteIds->contains($studyLog->id);
            });
        return response()->json($studyLogs);
    }

    public function update(Request $request, User $user) {

            $request->validate([
                'name' => 'string|max:255',
                'gender' => 'in:0,1,2,9',
                'birthday' => 'date',
                'occupation' => 'in:0,1,2,3',
                'introduction' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
                'tags' => 'array',
                'tags.*' => 'string'
            ]);

            if (!$this->common->authorizeAdminOrOwner($request, $user->id)) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            //画像保存
            $userIconImgPath = '';
            $profileImgPath = '';
            $image = $request->file('image');
            if(isset($image)) {
                $icon = $user->icon;
                $profileimg = $user->profileimg;
                try {
                    $userIconImgPath = $this->common->getSavedImgPath($image, 40, 40, 'uploads/images/icons/');
                    $profileImgPath = $this->common->getSavedImgPath($image, 250, 250, 'uploads/images/profile/');
                } catch (\Exception $e) {
                    return response()->json(['message' => $e->getMessage()], 500);
                }
                if(File::exists($icon)) {
                    File::delete($icon);
                }
                if(File::exists($profileimg)) {
                    File::delete($profileimg);
                }
            }

            return DB::transaction(function () use ($request, $user, $userIconImgPath, $profileImgPath) {
                //ユーザー情報更新
                $age = $user->age;
                if(isset($request->birthday)) {
                    $age = Carbon::parse($request->birthday)->age;
                }
                $user->update([
                    'name' => $request->name ?? $user->name,
                    'birthday' => $request->birthday ?? $user->birthday,
                    'age' => $age,
                    'gender' => $request->gender ?? $user->gender,
                    'occupation' => $request->occupation ?? $user->occupation,
                    'introduction' => $request->introduction,
                    'icon' => $userIconImgPath != '' ? $userIconImgPath : $user->icon,
                    'profileimg' => $profileImgPath != '' ? $profileImgPath : $user->profileimg
                ]);

                //タグ更新
                $tagNames = $request->tags ?? [];
                $tagIds = [];
        
                foreach($tagNames as $tagName) {
                    $tag = Tag::firstOrCreate(['tag_name' => $tagName]);
                    $tagIds[] = $tag->id;
                }
        
                $user->tags()->sync($tagIds);
                return response()->json(['message' => 'ユーザー情報を更新しました。']);
            });
    }
}
