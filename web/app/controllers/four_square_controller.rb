class FourSquareController < ApplicationController
  before_filter :ensure_foursquare, only: [:index]
  
  # GET /four_square.json
  # GET /four_square
  def index
    @results = FourSquare.new(foursquare_params).search
    respond_to do |format|
      format.html
      format.json { render json: {foursquare: @results} }
    end
  end
    
  def show
    fs = if params[:foursquare]
      FourSquare.new(four_square_params)
    else
      FourSquare.new
    end
    fs.upload_id = params[:id]
    @results = fs.search
    
    respond_to do |format|
      format.html
      format.json { render json: {foursquare: @results} }
    end
  end
    
    private
    def ensure_foursquare
     unless params[:foursquare]
       render :json=>{:error=>"missing required 'foursquare' parameter"}, :status=>422
     end
    end
    
    def foursquare_params
      params.require(:foursquare).permit(:query, :lat, :long)
    end
end