<?php

namespace App\Libraries;

use Illuminate\Http\Request;

class Common
{
    public function authorizeAdminOrOwner(Request $request, $id) {
        $user = $request->user();
        // var_dump($user->id);
        // var_dump($id);
        if($user->id !== intval($id) && !$user->is_admin) {
            return false;
        }
        return true;
    }
}