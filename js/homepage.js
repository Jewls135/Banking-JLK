// Starting effect
$(document).ready(function(){
    $('div').hide();
    $('.mainlogo').fadeIn(2000);
    $('.continue').fadeIn(2000);
});
// Functions below


// Events below
$('#continueButton').click(function(){
    $('.continue').fadeOut(1000);
    $('.mainlogo').fadeOut(1000);
    
    setTimeout(function(){ // Waiting 1.4 seconds before fading the form in
        $('.loginform').fadeIn(1000);
    }, 1400)
});