class ContactsController < ApplicationController
  
  # GET request to /contact-us
  # Show new contact form
  def new
    @contact = Contact.new
  end
  
  # POST request /contacts
  def create
    # Mass assignment of form fields into Contact object
    @contact = Contact.new(contact_params)
    # Saving the Contact object to the database
    if @contact.save
      # Stores form fields through params, into variables
      name = params[:contact][:name]
      email = params[:contact][:email]
      comments = params[:contact][:comments]
      # Puts variables into ContactMailer method and send email
      ContactMailer.contact_email(name, email, comments).deliver
      # Store success message in flash hash
      flash[:success] = "Message sent."
      # Redirects to new action
      redirect_to new_contact_path
    else
      # If Contact object doesn't save, 
      # store errors in flash hash and redirect back to new action
      flash[:danger] = @contact.errors.full_messages.join(", ")
      redirect_to new_contact_path
    end
  end
  
  private
  # To collect data from form, need strong parameters
  # and whitelist the form fields
    def contact_params
      params.require(:contact).permit(:name, :email, :comments)
    end
end