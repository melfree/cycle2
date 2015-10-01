class Upload < ActiveRecord::Base
  belongs_to :user
  has_many :purchases
  has_many :favorites
  
  # Create a dummy 'photos' attribute for bulk uploads
  attr_accessor :photos
  
  before_save :set_metadata
  
  validates_presence_of :photo
  
  scope :match_copyright, ->(copyright) do
    where(copyright: copyright)
  end
  # These attributes (tags and location) should have text searching, but that would require database changes.
  # To make things simpler for the team this cycle, text matching is simulated here.
  scope :match_tags, ->(tags) do
      tags_as_sql ="%(#{tags.split.join('|')})%"
      where("? SIMILAR TO tags", tags_as_sql)
  end
  scope :match_location, ->(location) { where("? ILIKE location", "%#{location}%") }
  
  # photo logic from `Carrierwave` uploader
  mount_base64_uploader :photo, PhotoUploader
  
  # Extract metadata from photo when first uploaded
  def set_metadata
    exifr = EXIFR::JPEG.new(photo.file.path)
    self.width = exifr.width #t.integer "width"
    self.height = exifr.height #t.integer "height"
    self.time = exifr.date_time #t.datetime "time"
    if exifr.exif?
      self.lat = exifr.gps.latitude #t.float "lat"
      self.long = exifr.gps.longitude #t.float "long"
    end
    # default t.integer "copyright" to 0
    self.copyright = 0 unless self.copyright == 1
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
