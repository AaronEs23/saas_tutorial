/*global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('pro_form');
  var submitBtn = $('#form-signup-btn');
  
  //Set Stripe public key.
  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content') );
  
  //When user clicks form submit btn.
  submitBtn.click(function(event){
    //prevent default submission behaviour.
  event.preventDefault();
  
  submitBtn.val("Processing").prop('disabled', true);
  
  //Collect the credit card fields.
  var ccNum = $('#card_number').val(),
      cvcNum = $('#card_code').val(),
      expMonth = $('#card_month').val(),
      expYear = $('#card_year').val();
      
  //Use Stripe JS library to check card errors.
  var error = false;
      
  //validate card number.
  if (!Stripe.card.validateCardNumber(ccNum)) {
    error = true;
    alert('The card number appears to be invalid.');
  }
  
  //validate CVC number.
  if (!Stripe.card.validateCVC(cvcNum)) {
    error = true;
    alert('The CVC appears to be invalid.');
  }
  
  //validate expiration date.
  if (!Stripe.card.validateExpiry(expMonth, expYear)) {
    error = true;
    alert('The expiration date appears to be invalid.');
  }
  
  if (error) {
    //If there are card errors, dont send to Stripe.
    submitBtn.prop('disabled', false).val("Sign Up");
    
  } else {
    //Send card info to stripe.
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
  }
  return false;
  });

  //Stripe returns card token.
  function stripeResponseHandler(status, response) {
    //Get token from response.
    var token = response.id;
    
    //Inject card token as hidden field into form.
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    //submit form to rails app.
    theForm.get(0).submit();
  }
});