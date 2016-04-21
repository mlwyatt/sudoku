class User < ActiveRecord::Base
  has_many :boards
#
#   attr_accessor :remember_token, :activation_token, :reset_token
#   before_save :downcase_email
#   before_create :create_activation_digest
#   VALID_EMAIL_FORMAT = /\A[a-z]+([\w+\-]*[.]?[\w+\-]+)*@[a-z]+([a-z\d]*[.]?[a-z\d]+)*\.[a-z]+([a-z\d]*[.]?[a-z\d]+)*\Z/i
# =begin
#                        or send an email to address with verification link to make sure it actually exists
#                        validating email using regex is getting out of hand!!!!!!!!
#                        /\A[a-z]+([\w+\-]*[.]?[\w+\-]+)*@[a-z]+([a-z\d]*[.]?[a-z\d]+)*\.[a-z]+([a-z\d]*[.]?[a-z\d]+)*\Z/i
#                        /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
# =end
#
#   has_secure_password
#   validates( :password, presence: true, length: { minimum: 6 }, allow_nil: true)
#   validates( :name,     presence: true, length: { maximum: 50 })
#   validates( :email,    presence: true, length: { maximum: 255 },
#              format: { with: VALID_EMAIL_FORMAT },
#              uniqueness: { case_sensitive: false }
#   )
#
#   class << self
#     # Returns the hash digest of the given string
#     def digest(string)
#       cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
#       return BCrypt::Password.create(string, cost: cost)
#     end
#
#     # Returns random toke
#     def new_token
#       return SecureRandom.urlsafe_base64
#     end
#   end
#
#   # Remembers a user in the database for use in persistent sessions
#   def remember
#     self.remember_token = User.new_token
#     update_attribute(:remember_digest, User.digest(remember_token))
#   end
#
#   # Forgets a user (logs out via cookies)
#   def forget
#     update_attribute(:remember_digest, nil)
#   end
#
#   # Returns true if given token matches the digest
#   def authenticated?(attribute, token)
#     digest = send("#{attribute}_digest")
#     return false if digest.nil?
#     return BCrypt::Password.new(digest).is_password?(token)
#   end
#
#   # Activates an account
#   def activate
#     update_columns(activated: true, activated_at: Time.zone.now)
#     # update_attribute(:activated,    true)
#     # update_attribute(:activated_at, Time.zone.now)
#   end
#
#   # Sends activation email
#   def send_activation_email
#     UserMailer.account_activation(self).deliver_now
#   end
#
#   # Sets the password reset attribute
#   def create_reset_digest
#     self.reset_token = User.new_token
#     update_columns(reset_digest: User.digest(reset_token), reset_sent_at: Time.zone.now)
#     # update_attribute(:reset_digest,  User.digest(reset_token))
#     # update_attribute(:reset_sent_at, Time.zone.now)
#   end
#
#   # Sends password reset email
#   def send_password_reset_email
#     UserMailer.password_reset(self).deliver_now
#   end
#
#   # Returns true if password reset has expired
#   def password_reset_expired?
#     return reset_sent_at < 2.hours.ago # phrased as reset sent earlier than 2 hours ago
#   end
#
#   def feed()
#     following_ids = 'SELECT followed_id FROM relationships WHERE follower_id = :user_id'
#     Micropost.where("user_id IN (#{following_ids}) OR user_id = :user_id", user_id: id)
#   end
#
#   # Follows a user
#   def follow(other_user)
#     active_relationships.create(followed_id: other_user.id)
#   end
#
#   # Unfollows a user
#   def unfollow(other_user)
#     active_relationships.find_by(followed_id: other_user.id).destroy
#   end
#
#   # Returns true if the current_user is following other_user
#   def following?(other_user)
#     return following.include?(other_user)
#   end
#
#   private
#
#   # Converts email to all lower-case
#   def downcase_email
#     email.downcase!()
#   end
#
#   # Creates and assigns the activation token and digest for the user
#   def create_activation_digest
#     self.activation_token  = User.new_token
#     self.activation_digest = User.digest(activation_token)
#   end
end

