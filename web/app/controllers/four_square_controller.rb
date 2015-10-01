class FourSquareController < ApplicationController
  # GET /four_square.json
  # GET /four_square
  def index
    four_square = FourSquare.new(four_square_params)
    
    @results = four_square.search
    
    respond_to do |format|
      format.html
      format.json { render json: @results }
    end
    
    private
    def four_square_params
      params.require(:four_square).permit(:upload_id, :query)
    end
  end
end