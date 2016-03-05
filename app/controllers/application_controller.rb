class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  require File.expand_path("#{Rails.root}/lib/to_new_date.rb")
  before_action :logged_in_user

  protected

  def force_trailing_slash
    redirect_to request.original_url + '/' unless request.original_url.match(/\/$/)
  end

  private

  def logged_in_user
    unless logged_in?
      store_location
      redirect_to login_url
    end
  end

  def admin_user
    redirect_to(root_url) unless current_user.admin?
  end

  def send_json(args)
    args ||= {}
    args.reverse_merge! :success => true, :statusTxt => 'OK'
    render :json => args, :layout => false, :status => 200
  end

  def find_company
    if params[:company_id].blank?
      @company = Company.find(params[:id]) rescue nil
    else
      @company= Company.find(params[:company_id])
    end
  end
end
