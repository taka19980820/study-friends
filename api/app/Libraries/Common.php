<?php

namespace App\Libraries;

use Illuminate\Http\Request;
use Image;

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
    
    public function getSavedImgPath($image, $width, $height, $savePath) {
        $filename = time() . '.' . $image->getClientOriginalExtension();
        $destinationPath = public_path($savePath);
        $resize_image = Image::make($image->getRealPath());
        
        $resize_image->resize($width, $height, function($constraint){
            $constraint->aspectRatio();
        })->save($destinationPath . $filename);

        return $savePath . $filename;
    }
}