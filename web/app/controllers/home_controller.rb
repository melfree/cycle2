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
  
  def existsuser
    @user = User.where(email: params[:email]).take
    @user = {error: "No user exists"} unless @user
    respond_to do |format|
      format.json { render json: @user }
    end
  end
end