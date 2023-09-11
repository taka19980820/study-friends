<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MyMaterialController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MaterialCommentController;
use App\Http\Controllers\MaterialFavoriteController;
use App\Http\Controllers\StudyLogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StudyRecordController;
use App\Http\Controllers\TagController;
use App\Http\Middleware\AdminCheck;
use App\Models\Favorite;
use App\Models\MyMaterial;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('register', [AuthController::class, 'register']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', function(Request $request) {
        return $request->user();
    });

    Route::put('/users/{user}/edit', [UserController::class, 'update']);
    Route::get('/users/{user}/study-hours', [StudyRecordController::class, 'getStudyTime']);
    Route::get('/users/{user}/study-hours/daily', [StudyRecordController::class, 'getDailyStudyTime']);
    Route::get('/users/{user}/study-hours/weekly', [StudyRecordController::class, 'getWeeklyStudyTime']);
    Route::get('/users/{user}/study-hours/monthly', [StudyRecordController::class, 'getMonthlyStudyTime']);
    Route::get('/users/{user}/materials', [UserController::class, 'getUserMaterials']);
    Route::get('/users/{user}/study-logs', [UserController::class, 'getUserLogs']);
    Route::get('/users/{user}/categories', [CategoryController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    
    Route::post('/materials/{material}/add', [MyMaterialController::class, 'addToMyMaterial']);
    Route::delete('/users/{user}/materials/{material}/remove', [MyMaterialController::class, 'removeFromMyMaterial']);
    Route::put('/users/{user}/myMaterials/{myMaterial}/edit', [MyMaterialController::class, 'editMyMaterial']);
    
    // Route::get('/users', [UserController::class, 'index']);

    Route::get('/accounts/{id}', [AccountController::class, 'show']);
    Route::post('/change-password', [AccountController::class, 'changePassword']);
    Route::post('/change-email', [AccountController::class, 'changeEmail']);
    Route::delete('/delete-accoount', [AccountController::class, 'delete']);
    Route::post('/materials', [MaterialController::class, 'create']);
    Route::get('/materials', [MaterialController::class, 'index']);
    Route::get('/materials/{id}', [MaterialController::class, 'show']);
    Route::put('/materials/{id}/edit', [MaterialController::class, 'update']);
    Route::post('/materials/{material}/like', [MaterialFavoriteController::class, 'like']);
    Route::delete('/materials/{material}/unlike', [MaterialFavoriteController::class, 'unlike']);

    Route::post('/materials/{material}/comments', [MaterialCommentController::class, 'create']);
    Route::delete('/materials/{material}/comments/{materialComment}', [MaterialCommentController::class, 'delete']);

    Route::post('/categories', [CategoryController::class, 'create']);
    Route::put('/categories/{category}/edit', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}/remove', [CategoryController::class, 'delete']);

    Route::post('/study-logs', [StudyLogController::class, 'create']);
    Route::get('/study-logs/{id}', [StudyLogController::class, 'show']);
    Route::put('/study-logs/{studyLog}/edit', [StudyLogController::class, 'update']);
    Route::delete('/study-logs/{studyLog}', [StudyLogController::class, 'delete']);
    Route::get('/study-logs', [StudyLogController::class, 'index']);
    Route::post('/study-logs/{studyLog}/comments', [CommentController::class, 'create']);
    Route::delete('/study-logs/{studyLog}/comments/{comment}', [CommentController::class, 'delete']);
    Route::post('/study-logs/{studyLog}/like', [FavoriteController::class, 'like']);
    Route::delete('/study-logs/{studyLog}/unlike', [FavoriteController::class, 'unlike']);

    Route::get('/tags', [TagController::class, 'index']);

    Route::post('/rooms/{room}/join', [RoomController::class, 'joinRoom']);
    Route::delete('/rooms/{room}/exit', [RoomController::class, 'exitRoom']);
    Route::post('/rooms', [RoomController::class, 'create']);
    Route::put('/rooms/{room}/edit', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}/delete', [RoomController::class, 'delete']);

    Route::post('/rooms/{room}/messages', [MessageController::class, 'create']);
    Route::delete('/rooms/{room}/messages/{message}', [MessageController::class, 'delete']);
    Route::get('/rooms/{room}/messages', [MessageController::class, 'index']);

    Route::get('/rooms/{room}', [RoomController::class, 'show']);
    Route::get('/rooms', [RoomController::class, 'index']);

});

//管理者のみアクセス可能
Route::group(['middleware' => ['auth:sanctum', AdminCheck::class]], function () {
    Route::get('/accounts', [AccountController::class, 'index']);
    Route::delete('/admin/delete-account', [AccountController::class, 'deleteUser']);
    Route::delete('/admin/delete-material/{id}', [MaterialController::class, 'delete']);
});
