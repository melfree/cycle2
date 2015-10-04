class FourSquare
  CLIENT_ID = '3NBVNWM2L50YSVBWPMWLPAVS0Q52ODDNNFU5IZY41XRGPP5J'
  CLIENT_SECRET = 'J45PYJ0K0NEMCIFHVKLDGDXJP0YVTPPC045E5DCWHXAHHIUB'
  API_VERSION = '20150927'
  
  attr_accessor :upload_id
  
  def initialize(options={})
    @query = options[:query]
    @lat = options[:lat]
    @long = options[:long]
  end
  
  def client
    @client ||= Foursquare2::Client.new(api_version: API_VERSION,
                                        client_id: CLIENT_ID,
                                        client_secret: CLIENT_SECRET)
  end
  
  def search
    if lat and long
      results = client.search_venues(ll: "#{lat},#{long}", query: @query, limit: 20)
      {results: results.venues.map{|o| o.name}}
    elsif upload
      {error: "This upload does not have lat/long values"}
    elsif upload_id
      {error: "The given upload_id (#{upload_id}) is unused"}
    else
      {error: "The given lat/long values were invalid"}
    end
  end
  
  def lat
    if upload
      upload.lat
    else
      @lat
    end
  end
  def long
    if upload
      upload.long
    else
      @long
    end
  end
  
  def upload
    @upload ||= Upload.find_by_id(upload_id)
  end
end
