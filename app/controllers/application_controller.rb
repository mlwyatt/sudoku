class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  include ApplicationHelper

  private

  def send_json(args)
    args ||= {}
    args.reverse_merge! :success => true, :statusTxt => 'OK'
    render :json => args, :layout => false, :status => 200
  end

  def logged_in_user
    unless logged_in?
      store_location
      flash[:danger] = 'Please log in.'
      redirect_to(login_url)
    end
  end

end
