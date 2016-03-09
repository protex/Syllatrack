/*
 * Function: request
 * 
 * Description: Creates the login request
 * 
 * Returns: *none*
 * 
 * Params: *none*
 */
function request() {
  // Create the login function
  login({
    // Grab the username from the email box
    username: $('#email').val(), 
    // Grab the password from the email box
    password: $('#psswrd').val(), 
    // Create a function to call the get syllabi function
    success: function(data){
        getSyllabiList( data.match(/\/students\/([0-9]*)/)[1], $('#email').val() );
    }, 
    // Create a function to show the failed login message on failure
    fail: function(data){
      $('#login_fail').toggleClass('hidden');  
    }
  });
}