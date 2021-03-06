class UploadSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :time, :css_class, :thumb_url, :photo_url, :height, :width, :location, :copyright_string, :copyright, :event, :lat, :long, :num_purchases, :current_user_uploaded, :current_user_purchased, :num_favorites, :current_user_favorited, :updated_at, :created_at
  has_one :user
  
  BASE_URL = 'http://localhost:3000'
  MISSING = "MISSING PHOTO URL"
  MISSING_THUMB = "MISSING THUMB PHOTO URL"
  
  def copyright_string
    if copyright
      "This photo is License Only."
    else
      "This photo is Free-to-Use."
    end
  end
  
  def created_at
    object.created_at.strftime("%a %m/%d/%y %I:%M %p")
  end
  
  def time
    if object.time
      object.time.strftime("%a %m/%d/%y %I:%M %p")
    end
  end
  
  def updated_at
    object.updated_at.strftime("%a %m/%d/%y %I:%M %p")
  end
  
  def css_class
    if current_user_purchased
      'purchased'
    elsif current_user_favorited
      'favorited'
    elsif current_user_uploaded
      'uploaded'
    else
      ''
    end
  end
  
  def copyright
    object.copyright == 1
  end
  
  # 'event' is overwritten so that 'event' = 'tags'
  def event
    object.tags
  end
  
  def current_user_purchased
    if scope
      o = Purchase.where(user_id: scope.id, upload_id: object.id).take
      return true if o
    end
    return false
  end
  
  def current_user_uploaded
    if scope
      return scope.id == object.user_id
    end
    return false
  end
  
  
  def num_purchases
    object.purchases.size
  end
  def num_favorites
    object.favorites.size
  end
  
  def current_user_favorited
    if scope
      o = Favorite.where(user_id: scope.id, upload_id: object.id).take
      return true if o
    end
    false
  end
  
  # Regular photo url.
  def photo_url
    if object.photo_url
      BASE_URL +  object.photo_url
    else
      MISSING
    end
  end
  
  # Thumb version of photo is a pre-computed standardized version of the original photo, set at 200x200.
  def thumb_url
    if object.photo_url(:thumb)
      BASE_URL  +  object.photo_url(:thumb)
    else
      MISSING_THUMB
    end
  end
  
  def thumb_width; thumb_height; end
  def thumb_height
    PhotoUploader::THUMB_SIZE
  end
end