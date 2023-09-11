<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\MyMaterial;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MyMaterialController extends Controller
{
    public function index(User $user) {
        $materials = $user->materials()->get();
        return response()->json($materials);
    }

    public function addToMyMaterial(Material $material, Request $request) {
        //バリデーション
        $request->validate([
            'category_id' => 'required|integer',
        ]);

        return DB::transaction(function () use ($material, $request) {
            $user = $request->user();
            $exist = $user->materials()->where('materials.id', $material->id)->first();

            // 存在しなければ追加
            if (!$exist) {
                $user->materials()->attach($material->id, [
                    'category_id' => $request->category_id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
            
            return response()->json(['message'=> 'My教材に追加しました']);
        });  
    }

    public function removeFromMyMaterial(Request $request, User $user, Material $material) {
        //materialIdを受け取って、myMaterialから関連を削除する
        $material->users()->detach($user->id);
        // $myMaterial->delete();
        return response()->json(['message'=> 'My教材から削除しました。']);
    }
    
    public function editMyMaterial(Request $request, User $user, MyMaterial $myMaterial) {
        $request->validate([
            'category_id' => 'required|integer',
        ]);
        $myMaterial->category_id = $request->category_id;
        // $res = MyMaterial::where('user_id', $user->id)
        //         ->where('material_id', $material->id)
        //         ->first();
        // $res->category_id = $request->category_id;
        $myMaterial->save();
        
        return response()->json($myMaterial);
    }


}