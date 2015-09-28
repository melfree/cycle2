class FourSquare
  CLIENT_ID = '3NBVNWM2L50YSVBWPMWLPAVS0Q52ODDNNFU5IZY41XRGPP5J'
  CLIENT_SECRET = 'J45PYJ0K0NEMCIFHVKLDGDXJP0YVTPPC045E5DCWHXAHHIUB'
  API_VERSION = '20150927'
  
  def initialize(options={})
    @query = options[:query]
    @upload_id = options[:upload_id]
  end
  
  def client
    @client ||= Foursquare2::Client.new(api_version: API_VERSION,
                                        client_id: CLIENT_ID,
                                        client_secret: CLIENT_SECRET)
  end
  
  def search
    if upload.lat and upload.long
      results = client.search_venues(ll: "#{upload.lat},#{upload.long}", limit: 20)
      results.venues.map{|o| {name: o.name, id: o.id, lat: o.location.lat,
                              long: o.location.lng, zip: o.location.postalCode,
                              category: o.categories.map{|oo| oo.name}.join(", ")} }
    else
      {upload: "missing lat/long values"}
    end
  end
  
  def upload
    @upload ||= Upload.find_by_id(@upload_id)
  end
end
