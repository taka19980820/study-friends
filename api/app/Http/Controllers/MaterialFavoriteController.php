<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\MaterialFavorite;
use Illuminate\Http\Request;


class MaterialFavoriteController extends Controller
{
    public function like(Material $material) {
        $res = $material->materialFavorites()->firstOrCreate([
            'user_id' => auth()->id(),
        ]);
        return response()->json($res);
    }

    public function unlike(Material $material) {
        $material->materialFavorites()->where('user_id', auth()->id())->delete();
        $res = $material->materialFavorites()->get();
        return response()->json($res, 200);
    }
}
