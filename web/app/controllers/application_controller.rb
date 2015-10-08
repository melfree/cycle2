class ApplicationController < ActionController::Base
  respond_to :html, :json
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  # JSON authtoken handler
  # https://github.com/gonzalo-bulnes/simple_token_authentication
  protect_from_forgery with: :null_session#, :if => Proc.new { |c| c.request.format == 'application/json' }
  
  def filter_uploads
    if @uploads
      l = params[:search]
      @uploads = @uploads.match_string(l) if l and !l.blank?
      c = params[:copyright]
      @uploads = @uploads.match_copyright(c) if c and !c.blank?
      
      s = params[:sort]
      @uploads = @uploads.sort_by(s) if s and !s.blank?
      b = params[:before]
      @uploads = @uploads.before(b) if b and !b.blank?
      a = params[:after]
      @uploads = @uploads.after(a) if a and !a.blank?
    end
  end
end
