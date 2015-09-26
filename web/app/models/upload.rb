class Upload < ActiveRecord::Base
  belongs_to :user
  has_many :purchases
  has_many :favorites
  
  # photo logic from `Carrierwave` uploader
  mount_base64_uploader :photo, PhotoUploader
  
  before_create :set_metadata
  
  # Extract metadata from photo when first uploaded
  def set_metadata
    exifr = EXIFR::JPEG.new(self.photo_url)
    if exifr.exif?
      self.width = exifr.width #t.integer "width"
      self.height = exifr.height #t.integer "height"
      self.time = exifr.date_time #t.datetime "time"
      self.lat = exifr.gps.latitude #t.float "lat"
      self.long = exifr.gps.longitude #t.float "long"
    end
    # default t.integer "copyright" to 0
    self.copyright = 0 unless self.copyright
    # t.text "tags" should also be created at this time.
    # t.string "location" should also be created at this time.
  end
  
  def copyright_status
    if self.copyright == 0
      "Free for use"
    else
      "Proprietary"
    end
  end
end
