class ApplicationController < ActionController::Base
  respond_to :html, :json
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  # JSON authtoken handler
  # https://github.com/gonzalo-bulnes/simple_token_authentication
  protect_from_forgery with: :null_session#, :if => Proc.new { |c| c.request.format == 'application/json' }
  
  def filter_uploads
    search = params[:search]
    if search and @uploads
      l = search[:location]
      @uploads = @uploads.match_location(l) if l and !l.blank?
      t = search[:event]
      @uploads = @uploads.match_tags(t) if t and !t.blank?
      c = search[:copyright]
      @uploads = @uploads.match_copyright(c) if c and !c.blank?
      
      s = search[:sort]
      @uploads = @uploads.sort_by(s) if s and !s.blank?
      b = search[:before]
      @uploads = @uploads.before(b) if b and !b.blank?
      a = search[:after]
      @uploads = @uploads.after(a) if a and !a.blank?
    end
  end
end
