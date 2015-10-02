class Upload < ActiveRecord::Base
  belongs_to :user
  has_many :purchases
  has_many :favorites
  
  # Create a dummy 'photos' attribute for bulk uploads
  attr_accessor :photos
  # 'tags' is now 'event', but will remain 'tags' within the database.
  # Therefore, 'event' is a fake instance variable that is filled into 'tags'. 
  attr_accessor :event
  
  before_save :set_metadata
  
  validates_presence_of :photo
  
  scope :match_copyright, ->(copyright) { where(copyright: copyright) }
  scope :match_tags, ->(tags) { where("? ILIKE tags", "%#{tags}%") }
  scope :match_location, ->(location) { where("? ILIKE location", "%#{location}%") }
  
  scope :after, ->(date) { where("time > ?", date) }
  scope :before, ->(date) { where("time < ?", date) }
  def self.sort_by(opt)
    opt = opt.downcase.strip
    opt = "tags" if opt == "event"
    if opt == "most_favorited"
      joins("LEFT JOIN favorites ON upload_id = uploads.id").group("uploads.id").order("count(favorites.id)")
    elsif opt == "most_purchased"
      joins("LEFT JOIN purchases ON upload_id = uploads.id").group("uploads.id").order("count(purchases.id)")
    elsif self.column_names.include?(opt)
      order("#{opt} desc")
    else # opt == "created_at"
      order("time desc")
    end
  end
  
  # photo logic from `Carrierwave` uploader
  mount_base64_uploader :photo, PhotoUploader
  
  # Extract metadata from photo when first uploaded
  def set_metadata
    exifr = EXIFR::JPEG.new(photo.file.path)
    self.width = exifr.width #t.integer "width"
    self.height = exifr.height #t.integer "height"
    self.time = exifr.date_time #t.datetime "time"
    if exifr.exif? and exifr.gps
      self.lat = exifr.gps.latitude #t.float "lat"
      self.long = exifr.gps.longitude #t.float "long"
    end
    # default t.integer "copyright" to 0
    self.copyright = 0 unless self.copyright == 1
    # t.text "tags" should also be created at this time.
    self.tags = self.event
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
