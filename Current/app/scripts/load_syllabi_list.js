// Require "fs" module
var fs = require('fs');

/*
 * Function: loadList
 * 
 * Description: Loads all data and sets up objects for easy list creation
 * 
 * Returns: none
 * 
 * Params: none
 */

function loadList () {
    var userHash, userData, userID, syllabiList, syllabiNames, syllabiInfo = [];
    
    // Load user.json
    userHash = JSON.parse( fs.readFileSync('users/users.json').toString() );
    // Set userID from global __user_id
    userID = __user_id.toString();
    // Set uerData to data of this user
    userData = userHash[userID];
    // Load the list of syllabi
    syllabiList = JSON.parse( fs.readFileSync('users/' + userID + '/syllabiList').toString() );
    // Load the list of syllabi names
    syllabiNames = JSON.parse( fs.readFileSync('users/' + userID + '/syllabiNames').toString() );
    // Combine syllabiList and syllabiNames
    for ( var i in syllabiList ) {
        // Extract ID from syllabiList[i] (syllabi list is a list of partial URL's)
        // Then get the corresponding name from syllabiNames
        // Push them both into the array as an object
        syllabiInfo.push({
            "ID": /syllabi\/(.+?)\/assignments/g.exec(syllabiList[i])[1],
            "name": syllabiNames[i].toString()
        });
    }
    
    // Send all this information to the next function to actually create the table
    createTable( userID, syllabiInfo);
    
}

/*
 * Function: createTable
 * 
 * Description: Creates the table with the list of syllabi
 * 
 * Returns: none
 * 
 * Params: userID - *string* - The users ID
 *         syllabiInfo - *array* - Array containing all the info we need about the syllabi
 * 
 */

function createTable ( userID, syllabiInfo) {
    for ( var i in syllabiInfo ) {
        if ( i != "length" ) {
            $('#syllabi_list').append('<tr><td><a href="' + syllabiInfo[i]['ID'] + '.html">' + syllabiInfo[i]['name'] + '</a></tr></td>');
        }
    }        
}
