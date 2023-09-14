<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\MyMaterial;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use App\Libraries\Common;

class MaterialController extends Controller
{
    private $common;

    public function __construct() {
        $this->common = new Common();
    }

    public function index(Request $request) {
        $query = Material::query();
        if($request->has('keyword')) {
            $keyword = $request->keyword;
            $query->where('material_name', 'like', "%{$keyword}%");
        }
        if($request->has('tags')) {
            $tags = explode(',', $request->tags);
            $query->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_name', $tags);
            });
        }
        $materials = $query->with([
            'tags',
            'materialComments.user' => function ($query) {
                $query->select('users.id', 'name', 'profileimg');
            },
            'materialFavorites'
        ])->latest('updated_at')->get();

        $userId = auth()->id();
        $favoriteIds = DB::table('material_favorites')
                           ->where('user_id', $userId)
                           ->pluck('material_id');
        $materials->each(function($material) use ($userId, $favoriteIds) {
            $material->is_registerd = $material->users->contains('id', $userId);
            $material->is_liked = $favoriteIds->contains($material->id);
        });
        return response()->json($materials);
    }

    public function show($id) {
        $material = Material::with([
            'tags' => function ($query) {
                $query->select('tags.id', 'tag_name');
            }, 
            'materialComments.user' => function ($query) {
                $query->select('id', 'name');
            },
            'materialFavorites',
        ])->find($id);
        if($material) {
            return response()->json($material);
        }
        return response()->json(['message' => '教材が見つかりませんでした。'], 404);
    }


    public function create(Request $request) {
        //バリデーション
        $request->validate([
            'material_name' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'pages' => 'nullable|integer',
            'publisher' => 'nullable|string|max:255',
            'category_id' => 'required|integer',
            'tags' => 'array',
            'tags.*' => 'string'
        ]);

        return DB::transaction(function () use ($request) {
            //教材テーブルに登録
            $material = new Material();
            $material->material_name = $request->material_name;
            $material->description = $request->description;
            $material->url = $request->url ?? null;
            $material->author = $request->author ?? null;
            $material->pages = $request->pages ?? null;
            $material->publisher = $request->publisher ?? null;
            $material->save();

            //タグ登録
            $tagNames = $request->tags ?? [];
            $tagIds = [];

            foreach($tagNames as $tagName) {
                $tag = Tag::firstOrCreate(['tag_name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $material->tags()->sync($tagIds);
            
            //My教材テーブルに登録
            $myMaterial = new MyMaterial();
            $myMaterial->user_id = auth()->id();
            $myMaterial->material_id = $material->id;
            $myMaterial->category_id = $request->category_id;
            $myMaterial->save();

            return response()->json(['message' => '教材を登録しました。']);
        });
    }

    public function update(Request $request, $id) {
        //バリデーション
        $request->validate([
            'material_name' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'pages' => 'nullable|integer',
            'publisher' => 'nullable|string|max:255',
            'tags' => 'array',
            'tags.*' => 'string'
        ]);

        $material = Material::find($id);
        if(!$material) {
            return response()->json(['message' => '教材が見つかりませんでした。'], 404);
        }

        return DB::transaction(function () use ($request, $material) {
            $material->update([
                'material_name' => $request->material_name,
                'description' => $request->description,
                'url' => $request->url,
                'author' => $request->author,
                'pages' => $request->pages,
                'publisher' => $request->publisher
            ]);

            //タグ更新
            $tagNames = $request->tags ?? [];
            $tagIds = [];
    
            foreach($tagNames as $tagName) {
                $tag = Tag::firstOrCreate(['tag_name' => $tagName]);
                $tagIds[] = $tag->id;
            }
    
            $material->tags()->sync($tagIds);
            return response()->json(['message' => '教材情報を更新しました。']);
        });
    }

    public function delete($id) {
        $material = Material::find($id);
        if(!$material) {
            return response()->json(['message' => '教材が見つかりませんでした']);
        }
        $material->delete();
        return response()->json(['message' => '教材を削除しました'], 200);
    }
}
