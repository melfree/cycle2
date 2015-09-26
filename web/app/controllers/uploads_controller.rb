class UploadsController < ApplicationController
  # GET /explore
  def index
    @uploads = Upload.all
    respond_to do |format|
      format.html
      format.json { render json: uploads }
    end
  end

  # GET /new
  def new
    @user = current_user
  end
  
  def upload
    respond_to do |format|
      if @user.update(upload_params)
        format.html { redirect_to @user, notice: 'Uploads were successfully saved.' }
        format.json { render json: @user, status: :ok }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

 private
   def upload_params
      params.require(:user).permit(uploads_attributes: [:id, :location, :user_id, :photo, :tags, :copyright])
   end
end