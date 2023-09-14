<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'age' => $this->age,
            'occupation' => $this->occupation,
            'introduction' => $this->introduction,
            'icon' => $this->icon,
            'profileimg' => $this->profileimg,
            'tags' => $this->whenLoaded('tags'),
            'rooms' => $this->whenLoaded('rooms'),
            'materials' => $this->whenLoaded('materials'),
            'categories' => $this->whenLoaded('categories'),
            'studyLogs' => $this->whenLoaded('studyLogs'),
            'materialComments' => $this->whenLoaded('materialComments'),
            'comments' => $this->whenLoaded('comments'),
            'materialFavorites' => $this->whenLoaded('materialFavorites'),
        ];
    }
}
