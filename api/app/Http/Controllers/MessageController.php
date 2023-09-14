<?php

namespace App\Http\Controllers;

use App\Events\SentMessage;
use App\Models\Message;
use App\Models\Room;
use Illuminate\Http\Request;


class MessageController extends Controller
{
    public function index(Room $room) {
        if(!$room->users->contains(auth()->id()) && !auth()->user()->is_admin) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        $messages = $room->messages()->with([
            'user' => function ($query) {
                $query->select('users.id','name', 'profileimg');
            }
        ])->get();
        return response()->json($messages);
    }

    public function create(Room $room, Request $request) {
        
        $request->validate([
            'message' => 'required|string'
        ]);
        if(!$room->users->contains(auth()->id())) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        $message = $room->messages()->create([
            'message' => $request->message,
            'user_id' => auth()->id()
        ]);
        $result = $room->messages()->with([
            'user' => function ($query) {
                $query->select('users.id','name');
            }
        ])->find($message->id);
        $response = $result->toArray();
        event(new SentMessage($room->id, $response));
        
        return response()->json($response, 200);
    }

    public function delete(Room $room, Message $message) {
        if(!$room->users->contains(auth()->id()) && !auth()->user()->is_admin) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        if($message->user_id !== auth()->id() && !auth()->user()->is_admin) {
            return response()->json(['message' => '権限がありません。'], 403);
        }
        $message->delete();
        return response()->json(['message' => 'メッセージを削除しました']);
    }

    
}
