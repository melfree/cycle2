class UploadsController < ApplicationController
  before_action :set_upload, only: [:show, :edit, :update, :destroy]
  
  ## JSON routes
  ##############
  
  # GET /uploads/1
  # GET /uploads/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @upload }
    end
  end
  
  # GET /uploads.json
  # GET /uploads
  def index
    @uploads = Upload.all
    respond_to do |format|
      format.html
      format.json { render json: @uploads }
    end
  end
  
  # PATCH/PUT /uploads/1.json
  # PATCH/PUT /uploads/1
  # updates a single photo
  def update
    respond_to do |format|
      if @upload.update(upload_params)
        format.html { redirect_to @upload, notice: 'Upload was successfully saved.' }
        format.json { render json: @upload, status: :ok }
      else
        format.html { render :edit }
        format.json { render json: @upload.errors, status: :unprocessable_entity }
      end
    end
  end
  
  # POST /uploads
  # POST /uploads.json
  # creates a single photo, OR an array of photos
  def create
    @upload = Upload.new(upload_params)
    respond_to do |format|
      if @upload.photos ## Batch photo upload
        ## Take each photo out of the photo array and place into its own upload object
        batch = @upload.photos.map do |a|
          upload_params.merge(photo: a)
        end
        # Save the collection of objects
        success = current_user.uploads.create ( batch )
      else # Simple single photo upload
        success = current_user.uploads.create ( upload_params )
      end
      if success
        format.html { redirect_to uploads_url, notice: 'Upload was successfully saved.' }
        format.json { render json: current_user.uploads, status: :created }
      else
        format.html { render :new }
        format.json { render json: @upload.errors, status: :unprocessable_entity }
      end
      
    end
  end
  
  # DELETE /uploads/1
  # DELETE /uploads/1.json
  def destroy
    @upload.destroy
    respond_to do |format|
      format.html { redirect_to uploads_url, notice: 'Photo was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  
  ## NON-JSON routes
  ##################

  # GET /uploads/1/edit
  def edit
  end
  
  # GET /uploads/new
  def new
    @upload = Upload.new
  end
  
 private
   def set_upload
     @upload = Upload.find(params[:id])
   end
 
   def upload_params
      params.require(:upload).permit(:location, :photo, :tags, :copyright, :photos => [])
   end
end