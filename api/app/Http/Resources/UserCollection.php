<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->transform(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'gender' => $user->gender,
                'birthday' => $user->birthday,
                'age' => $user->age,
                'occupation' => $user->occupation,
                'introduction' => $user->introduction,
                'tags' => $user->tags,
            ];
        })->toArray();
    }
}
