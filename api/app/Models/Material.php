<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_name',
        'description',
        'url',
        'author',
        'pages',
        'publisher'
    ];

    public function myMaterials() {
        return $this->hasMany(MyMaterial::class);
    }

    public function tags() {
        return $this->belongsToMany(Tag::class, 'material_tag');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'my_materials');
    }

    public function materialComments() {
        return $this->hasMany(MaterialComment::class);
    }

    public function materialFavorites() {
        return $this->hasMany(MaterialFavorite::class);
    }
}
