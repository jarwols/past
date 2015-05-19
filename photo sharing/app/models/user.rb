class User < ActiveRecord::Base
	has_many :photos
	has_many :comments

	validate :validate_user 

	def validate_user 
		if self.first_name == "" || self.last_name == "" || self.login == "" || self.password == "" then 
			errors.add(:user, "must fill all required fields")
		end
	end
	def password_valid?(password) 
		# retrieve salt 
		# retrieve digest (users digest)
		# new digest (password + salt))
		# compare digests
		salt = self.salt
		digest = self.digest 
		puts(digest)
		puts(salt)
		new_digest = Digest::SHA1.hexdigest(password + salt) 
		puts(new_digest)
		if (digest == new_digest)
			return true
		else 
			return false 
		end 
	end 
	def password
		@password 
	end 
	def password= (password) 
		# generate a salt
		# digest the above password
		# add the digest to db
		@password = password.to_s 
		self.salt = Random.rand.to_s 
		self.digest = Digest::SHA1.hexdigest(@password + salt) 
		self.save
	end 
	def name; "#{first_name} #{last_name}";end
end
 