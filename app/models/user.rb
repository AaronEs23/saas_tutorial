class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         
  belongs_to :plan
  
  attr_accessor :stripe_card_token
  #If PRO user passes validations (email, password, etc)
  #then call Stripe and set up subscription
  #upon charging the customers card.
  #Stripe responds with customer data.
  #Store customer.id as customer token and save user.
  def save_with_subscription
    if valid?
      customer = Stripe::Customer.create(description: email, plan: plan_id, card: stripe_card_token)
     self.stripe_customer_token = customer.id
     save!
    end
  end
end
