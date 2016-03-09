/*
 * Function: login
 * 
 * Description: Sends a login request, runs a fail function or success function depending on measure of success
 * 
 * Returns: returnText - *string* - The html of the page after the attempted login
 * 
 * Params: settings - *obj* - The settings for the login request
 *          username - *str* - The username (email)
 *          password - *str* - The password
 *          fail - *func* - A function to run on fail
 *          success - *func* - A function to run on success
 * 
 */
var login = function(settings) {
  var username, password, returnText, invalidReg;
  
  username = settings.username;
  password = settings.password;
  invalidReg = /Invalid user name or password. Please verify them and try again./i;
  returnText = $.ajax({
    type: "POST",
    url: 'https://families.motherofdivinegrace.org/login',
    data: {'username':username, 'password':password},
    success: function(data) {
      returnText = data;
      if ( settings.hasOwnProperty('fail') ) {
        if ( (returnText.match(invalidReg) != null) && (typeof settings.fail) == 'function' ) {
          settings.fail(returnText);
        }
      }
      
      if ( settings.hasOwnProperty('success') ) {
        if ( returnText.match(invalidReg) == null && (typeof settings.success) == 'function' ) {
          settings.success(returnText);
        }
      }      
    }
  });
  
};