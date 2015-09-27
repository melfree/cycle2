class HomeController < ApplicationController
  # GET /home.json
  # GET /home
  def index
    @uploads = Upload.all
    respond_to do |format|
      format.html
      format.json { render json: @uploads }
    end
  end
end