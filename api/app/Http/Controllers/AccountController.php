<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use App\Libraries\Common;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    private $common;

    public function __construct() {
        $this->common = new Common();
    }

    public function index(Request $request) {
        $users = User::select('id', 'name', 'email', 'is_admin')->get();
        return response()->json($users);
    }

    public function show(Request $request, $id) {
        $user = User::select('id', 'name','email')->where('id', $id)->first();
        if(!$user) {
            return response()->json(['message' => 'ユーザーが見つかりませんでした。'], 404);
        }
        if (!$this->common->authorizeAdminOrOwner($request, $id)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        return response()->json($user);
    }

    public function changeEmail(Request $request) {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users'
        ]);

        $request->user()->update([
            'email' => $request->email
        ]);

        return response()->json(['message' => 'メールアドレスを更新しました']);
    }

    public function changePassword(Request $request) {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        // 現在のパスワードが正しいか確認
        if (!Hash::check($request->current_password, $request->user()->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['現在のパスワードが間違っています']
            ]);
        }

        // 新しいパスワードをハッシュ化して保存
        $request->user()->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'パスワードを更新しました']);

    }

    public function delete() {
        $user = Auth::user();
        $user->delete();
        return response()->json(['message' => 'アカウントを削除しました'], 200);
    }

    public function deleteUser(Request $request) {
        $ids = $request->input('ids');
        User::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'アカウントを削除しました']);
    }
}
