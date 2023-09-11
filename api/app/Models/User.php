<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'birthday',
        'age',
        'occupation',
        'introduction'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function tags() {
        return $this->belongsToMany(Tag::class, 'user_tag');
    }

    public function rooms() {
        return $this->belongsToMany(Room::class, 'room_user');
    }

    public function isMemberOfRoom($roomId)
    {
        return $this->rooms()->where('rooms.id', $roomId)->exists();
    }

    public function materials() {
        return $this->belongsToMany(Material::class, 'my_materials');
    }

    public function messasges() {
        return $this->hasMany(Message::class);
    }

    // public function myMaterials() {
    //     return $this->hasMany(MyMaterial::class);
    // }

    public function categories() {
        return $this->hasMany(Category::class);
    }

    public function studyLogs() {
        return $this->hasMany(StudyLog::class);
    }

    public function materialComments() {
        return $this->hasMany(MaterialComment::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function materialFavorites() {
        return $this->hasMany(MaterialFavorite::class);
    }

    public function getIsAdminAttribute() {
        return $this->attributes['is_admin'] == 1;
    }
}
