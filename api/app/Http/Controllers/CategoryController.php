<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\MyMaterial;
use App\Models\User;
use Illuminate\Support\Facades\DB;


class CategoryController extends Controller
{
    public function create(Request $request) {
        //バリデーション
        $request->validate([
            'category_name' => 'required|string|max:255',
            'category_color' => 'required|string',
        ]);

        $category = new Category();
        $category->category_name = $request->category_name;
        $category->category_color = $request->category_color;
        $category->user_id = auth()->id();

        $category->save();

        return response()->json($category, 200);
    }

    public function update(Request $request, Category $category) {
        $request->validate([
            'category_name' => 'string|max:255',
            'category_color' => 'string',
        ]);
        $category->update([
            'category_name' => $request->category_name ?? $category->category_name,
            'category_color' => $request->category_color ?? $category->category_color
        ]);
        // $category->category_name = $request->category_name ?? $category->category_name; 
        // $category->category_color = $request->category_color ?? $category->category_color; 
        // $category->save();
        return response()->json(['message' => '更新が完了しました。']);
    }

    public function delete(Request $request, Category $category) {
        //カテゴリを削除する前にMy教材のカテゴリをすべうてカテゴリなし(1)に変更する
        $userId = auth()->id();
        return DB::transaction(function () use ($request, $category, $userId) {
            $myMaterials = MyMaterial::where('user_id', $userId)->where('category_id',$category->id)->get();
            foreach($myMaterials as $myMaterial) {
                $myMaterial->category_id = 1;
                $myMaterial->save();
            }
            $category->delete();
            return response()->json(['message' => '削除しました']);
        });
    }

    public function index(User $user) {
        $userId = $user->id;
        if($userId !== auth()->id()) {
            return response()->json(['message' => '権限がありません'], 403);
        }
        $categories = Category::where('user_id', $userId)
                                ->orWhereNull('user_id')
                                ->get();
        return response()->json($categories);
    }
}
