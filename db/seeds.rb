user = [
    ['Marcus', 'Wyatt', 'mwyatt@brandsinsurance.com', 'password', 'password', true, true, Time.zone.now],
]

user.each do |fname, lname, email, pass, passconf, admin, activated, act_at|
  User.create( first_name: fname, last_name: lname, email: email, password: pass, password_confirmation: passconf, admin: admin, activated: activated, activated_at: act_at )
end