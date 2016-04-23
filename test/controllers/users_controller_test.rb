require 'test_helper'

class UsersControllerTest < ActionController::TestCase

  def setup
    @user  = users(:marcus)
    @other = users(:marcus2)
  end

  title = 'Sudoku'
  bar = ' | '
  barred_title = bar + title

  test 'should get new' do
    get :new
    assert_response :success
    assert_select 'title',/Contact#{barred_title}|#{title}/
  end

  test 'should redirect edit when not logged in' do
    get :edit, id: @user
    assert_not flash.empty?
    assert_redirected_to login_url
  end

  test 'should redirect edit when logged in as wrong user' do
    log_in_as(@other)
    get :edit, id: @user
    assert flash.empty?
    assert_redirected_to root_url
  end

  test 'should redirect update when not logged in' do
    patch :update, id: @user, user: { name: @user.name, email: @user.email }
    assert_not flash.empty?
    assert_redirected_to login_url
  end

  test 'should redirect update when logged in as wrong user' do
    log_in_as(@other)
    patch :update, id: @user, user: { name: @user.name, email: @user.email }
    assert flash.empty?
    assert_redirected_to root_url
  end

  test 'should redirect index when not logged in' do
    get :index
    assert_redirected_to login_url
  end

  test 'should redirect destroy when not logged in' do
    assert_no_difference 'User.count' do
      delete :destroy, id: @user
    end
    assert_redirected_to login_url
  end

  test 'should redirect destroy when not admin user' do
    log_in_as(@other)
    assert_no_difference 'User.count' do
      delete :destroy, id: @user
    end
    assert_redirected_to root_url
  end

  test 'should not allow the admin attribute to be edited via the web' do
    log_in_as(@other)
    assert_not @other.admin?
    patch :update, id: @other, user: { password:              '',
                                       password_confirmation: '',
                                       admin: true }
    assert_not @other.reload.admin?
  end

end
