<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

class BroadcastController extends Controller
{
    public function authenticate(Request $request) {
        Log::info("info: ". $request->headers);
        $channelName = $request->channel_name;
        $roomId = explode('.', str_replace('private-', '', $channelName))[1];
    
        if ($request->user()->isMemberOfRoom($roomId)) {
            return Broadcast::auth($request);
        } else {
            return response(['message' => 'Permission denied'], 403);
        }
    }
}
