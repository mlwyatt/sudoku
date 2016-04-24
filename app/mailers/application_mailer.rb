class ApplicationMailer < ActionMailer::Base
  default from: 'no-reply@sudoku-app-mlw.heroku.com'
  layout 'mailer'
end
