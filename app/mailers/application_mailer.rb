class ApplicationMailer < ActionMailer::Base
  default from: 'no-reply@sudoku-app-mlw.herokuapp.com'
  layout 'mailer'
end
